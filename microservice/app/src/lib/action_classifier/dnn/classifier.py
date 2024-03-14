# -*- coding: utf-8 -*-
'''
This script includes:

1. ClassifierOfflineTrain
    This is for offline training. The input data are the processed features.
2. class ClassifierOnlineTest(object)
    This is for online testing. The input data are the raw skeletons.
    It uses FeatureGenerator to extract features,
    and then use ClassifierOfflineTrain to recognize the action.
    Notice, this model is only for recognizing the action of one person.

TODO: Add more comments to this function.
'''
import os

import joblib
from sklearn.decomposition import PCA
from torch import nn

import numpy as np
from collections import deque
import cv2

import torch
from app.src.lib.action_classifier.dnn.feature_procs import FeatureGenerator

# -- Settings
NUM_FEATURES_FROM_PCA = 50


# -- Classes

class MLPClassifier(nn.Module):
    def __init__(self, input_size, hidden_sizes, output_size):
        super(MLPClassifier, self).__init__()

        self.hidden_layers = nn.Sequential()
        for in_size, out_size in zip([input_size] + hidden_sizes[:-1], hidden_sizes):
            self.hidden_layers.add_module(
                f"layer_{len(self.hidden_layers)}",
                nn.Sequential(
                    nn.Linear(in_size, out_size),
                    nn.BatchNorm1d(out_size),
                    nn.ReLU()
                )
            )

        self.output_layer = nn.Linear(hidden_sizes[-1], output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        for layer in self.hidden_layers:
            x = layer(x)
        x = self.output_layer(x)
        x = self.softmax(x)
        return x


class ClassifierOnlineTest(object):
    def __init__(self, model_path, action_labels, window_size, human_id=0, threshold=0.7):
        self.model = None
        self.human_id = human_id
        self.model_path = model_path
        self.action_labels = action_labels
        self.threshold = threshold
        self.window_size = window_size
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        self.load_model()

        self.feature_generator = FeatureGenerator(window_size)
        with open(os.path.join(os.path.dirname(model_path), "pca.pkl"), 'rb') as f:
            self.pca = joblib.load(f)
        self.reset()

    def load_model(self):
        self.model = MLPClassifier(
            input_size=50, hidden_sizes=[1024, 512], output_size=len(self.action_labels)
        ).to(self.device)
        model_path = self.model_path

        if not os.path.isfile(model_path):
            raise FileNotFoundError(f"Model file not found at path: {model_path}")
        self.model.load_state_dict(torch.load(self.model_path))
        self.model.eval()

    def reset(self):
        self.feature_generator.reset()
        self.scores_hist = deque()
        self.scores = None

    def predict(self, skeleton):
        is_features_good, features = self.feature_generator.add_cur_skeleton(skeleton)

        if is_features_good:
            features_pca = self.pca.transform(features.reshape(1, -1))
            features_tensor = torch.tensor(features_pca, dtype=torch.float32)
            with torch.no_grad():
                curr_scores = self.model(features_tensor.cuda())
            self.scores = self.smooth_scores(curr_scores.cpu().numpy()[0])

            if self.scores.max() < self.threshold:
                prediced_label = ['', 0]
            else:
                predicted_idx = self.scores.argmax()
                prediced_label = [self.action_labels[predicted_idx], self.scores.max()]
        else:
            prediced_label = ['', 0]

        return prediced_label

    def smooth_scores(self, curr_scores):
        ''' Smooth the current prediction score
            by taking the average with previous scores
        '''
        self.scores_hist.append(curr_scores)
        DEQUE_MAX_SIZE = 2
        if len(self.scores_hist) > DEQUE_MAX_SIZE:
            self.scores_hist.popleft()

        if 1:  # Use sum
            score_sums = np.zeros((len(self.action_labels),))
            for score in self.scores_hist:
                score_sums += score
            score_sums /= len(self.scores_hist)
            # print("\nMean score:\n", score_sums)
            return score_sums

        else:  # Use multiply
            score_mul = np.ones((len(self.action_labels),))
            for score in self.scores_hist:
                score_mul *= score
            return score_mul

    def draw_scores_onto_image(self, img_disp):
        if self.scores is None:
            return

        for i in range(-1, len(self.action_labels)):

            FONT_SIZE = 0.7
            TXT_X = 20
            TXT_Y = 150 + i * 30
            COLOR_INTENSITY = 255

            if i == -1:
                s = "P{}:".format(self.human_id)
            else:
                label = self.action_labels[i]
                s = "{:<5}: {:.2f}".format(label, self.scores[i])
                COLOR_INTENSITY *= (0.0 + 1.0 * self.scores[i]) ** 0.5

            cv2.putText(img_disp, text=s, org=(TXT_X, TXT_Y),
                        fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=FONT_SIZE,
                        color=(0, 0, int(COLOR_INTENSITY)), thickness=2)


class MultiPersonClassifier(object):
    ''' This is a wrapper around ClassifierOnlineTest
        for recognizing actions of multiple people.
    '''

    def __init__(self, model_path, classes, window_size=5, threshold=0.7):

        self.dict_id2clf = {}  # human id -> action_classifier of this person
        if isinstance(model_path, (list, tuple)):
            model_path = os.path.join(*model_path)
        # Define a function for creating action_classifier for new people.
        self._create_classifier = lambda human_id: ClassifierOnlineTest(
            model_path, classes, window_size, human_id, threshold=threshold)

    def classify(self, predictions):
        ''' Classify the action type of each skeleton in dict_id2skeleton '''

        dict_id2skeleton = {pred.id: pred.flatten_keypoints for pred in predictions}
        # Clear people not in view
        old_ids = set(self.dict_id2clf)
        cur_ids = set(dict_id2skeleton)
        humans_not_in_view = list(old_ids - cur_ids)  # check person is missed or not
        for human in humans_not_in_view:
            del self.dict_id2clf[human]

        # Predict each person's action
        # actions = {}
        for idx, (id, skeleton) in enumerate(dict_id2skeleton.items()):
            if id not in self.dict_id2clf:  # add this new person
                self.dict_id2clf[id] = self._create_classifier(id)

            classifier = self.dict_id2clf[id]
            # actions[id] = action_classifier.predict(skeleton)  # predict label
            predictions[idx].action = classifier.predict(skeleton)

        return predictions

    def get_classifier(self, id):
        ''' Get the action_classifier based on the person id.
        Arguments:
            id {int or "min"}
        '''
        if len(self.dict_id2clf) == 0:
            return None
        if id == 'min':
            id = min(self.dict_id2clf.keys())
        return self.dict_id2clf[id]
