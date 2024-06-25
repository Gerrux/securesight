import React, {useState} from 'react';
import {Button, Col, Container, Form, Row, Toast, ProgressBar} from 'react-bootstrap';
import ApiClient from '../ApiClient';
import {useStateContext} from '../contexts/ContextProvider';
import Cookies from "js-cookie";
import '../styles/video_upload_form.css';

const VideoUploadForm = ({onClose}) => {
    const {currentMode} = useStateContext();
    const [selectedFile, setSelectedFile] = useState(null);
    const [title, setTitle] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [progress, setProgress] = useState(0); // Новое состояние для прогресса загрузки

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setTitle(file.name);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setToastMessage('Please select a file');
            setShowToast(true);
            return;
        }

        if (!title) {
            setToastMessage('Please enter a title');
            setShowToast(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', title);

        ApiClient.post('/backvideos/upload/', formData, { // используем ваш apiClient
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${Cookies.get('access')}`
            },
            onUploadProgress: (ProgressEvent) => {
                setProgress(Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total));
            }
        })
            .then(response => {
                console.log(response.data);
                setSelectedFile(null);
                setTitle('');
                setToastMessage('Video uploaded successfully');
                setShowToast(true);
                setProgress(0); // Сбросить прогресс после загрузки
                if (onClose) {
                    onClose();
                }
            })
            .catch(error => {
                console.error(error);
                setToastMessage('There was an error uploading the video');
                setShowToast(true);
                setProgress(0); // Сбросить прогресс в случае ошибки
            });
    };

    return (
        <Container className={`video-upload-form ${currentMode === 'Dark' ? 'dark-mode' : ''}`}>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Label htmlFor="title">Название</Form.Label>
                        <Form.Control className="w-100" type="text" id="title" placeholder="Title" value={title}
                                      onChange={handleTitleChange}/>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Label htmlFor="video">Видеоролик</Form.Label>
                        <Form.Control className="w-100" type="file" id="video" onChange={handleFileChange}/>
                    </Col>
                </Row>
                <ProgressBar animated now={progress} label={`${progress}%`} /> {/* Показатель прогресса */}
                <Button type="submit">Загрузить</Button>
            </Form>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">Upload Status</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default VideoUploadForm;
