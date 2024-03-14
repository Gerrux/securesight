import json
import os
import tempfile
import cv2

from app.src.lib.action_classifier import get_classifier
from app.src.lib.pose_estimation import get_pose_estimator
from app.src.lib.tracker import get_tracker
from app.src.lib.utils.config import Config
from app.src.lib.utils.drawer import Drawer
from app.src.lib.utils.utils import convert_to_openpose_skeletons
from app.src.lib.utils.video import Video


def process_video(file):
    # Create temporary input file to store the uploaded video
    with tempfile.NamedTemporaryFile(delete=False) as tmp_input_file:
        tmp_input_file.write(file.file.read())
        input_video_path = tmp_input_file.name

    root_dir = os.path.dirname(os.path.abspath(__file__))
    output_video_path = os.path.join(root_dir, "processed_video.mp4")

    # Configs
    cfg = Config("app/src/configs/infer_trtpose_deepsort_dnn.yaml")
    pose_kwargs = cfg.POSE
    clf_kwargs = cfg.CLASSIFIER
    tracker_kwargs = cfg.TRACKER

    # Initiate video/webcam
    video = Video(input_video_path)

    # Initiate trtpose, deepsort and action action_classifier
    pose_estimator = get_pose_estimator(**pose_kwargs)
    tracker = get_tracker(**tracker_kwargs)
    action_classifier = get_classifier(**clf_kwargs)

    # Initiate drawer and text for visualization
    drawer = Drawer()
    user_text = {
        'text_color': 'green',
        'add_blank': False,
        'Mode': 'action',
    }

    # Initialize video writer
    output_width = int(video.width)
    output_height = int(video.height)
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(output_video_path, fourcc, video.fps, (output_width, output_height))

    log_entries = []
    timestamp_prev = 0

    for bgr_frame, timestamp in video:
        rgb_frame = cv2.cvtColor(bgr_frame, cv2.COLOR_BGR2RGB)

        # Predict pose estimation
        predictions = pose_estimator.predict(rgb_frame, get_bbox=True)
        if len(predictions) == 0:
            tracker.increment_ages()
        else:
            # Tracking
            predictions = convert_to_openpose_skeletons(predictions)
            predictions, debug_img = tracker.predict(rgb_frame, predictions)
            if len(predictions) > 0:
                predictions = action_classifier.classify(predictions)

        # Draw predicted results on bgr_img with frame info
        render_image = drawer.render_frame(bgr_frame, predictions, **user_text)

        # Write the processed frame to the output video file
        out.write(render_image)

        if timestamp - timestamp_prev >= 1:
            num_people = len(predictions)
            actions = [p.action for p in predictions if hasattr(p, 'action')]
            if not actions:
                actions = ['']
            log_entry = {"Timestamp": timestamp, "Frame": video.frame_cnt, "Num_People": num_people,
                         "Actions": actions}
            log_entries.append(log_entry)
            timestamp_prev = timestamp

    out.release()

    # Remove the temporary input file
    os.remove(input_video_path)

    # Convert log entries to JSON
    log_json = json.dumps(log_entries, default=str)

    return output_video_path, log_json
