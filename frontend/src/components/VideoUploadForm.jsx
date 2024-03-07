import React, { useState } from 'react';
import {Form, Button, FormControl, Row, Col, Toast, Container} from 'react-bootstrap';

const VideoUploadForm = ({ apiClient }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    generatePreview(file);
    setTitle(file.name);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const generatePreview = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
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
    apiClient.post('/videos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log(response.data);
      setSelectedFile(null);
      setTitle('');
      setPreviewUrl(null);
      setToastMessage('Video uploaded successfully');
      setShowToast(true);
    })
    .catch(error => {
      console.error(error);
      setToastMessage('There was an error uploading the video');
      setShowToast(true);
    });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor="title">Title</Form.Label>
            <Form.Control type="text" id="title" placeholder="Title" value={title} onChange={handleTitleChange} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Label htmlFor="video">Video</Form.Label>
            <Form.Control type="file" id="video" onChange={handleFileChange} />
          </Col>
        </Row>
        {previewUrl && (
          <Row className="mb-3">
            <Col>
              <img src={previewUrl} alt="Video Preview" />
            </Col>
          </Row>
        )}
        <Button type="submit">Upload</Button>
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
