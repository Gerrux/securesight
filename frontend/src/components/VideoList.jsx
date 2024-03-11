import React, {useEffect, useState} from 'react';
import ApiClient from '../ApiClient';
import {Button, Card, Col, ListGroup, Modal, Row, Spinner} from 'react-bootstrap';
import {FaCheckCircle, FaSyncAlt, FaTrashAlt} from 'react-icons/fa';
import '../styles/video_list.css';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const response = await ApiClient.get('/videos/');
                setVideos(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = async (slug) => {
        try {
            await ApiClient.delete(`/videos/${slug}/`);
            setVideos(videos.filter((video) => video.slug !== slug));
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartProcessing = async (slug) => {
        try {
            await ApiClient.post(`/videos/${slug}/process/`);
            setVideos(
                videos.map((video) =>
                    video.slug === slug ? {...video, processed: true} : video
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (slug) => {
        setSelectedVideoId(slug);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div>
            <Row>
                <Col>
                    {videos.length === 0 && !loading && (
                        <div className="text-center no-videos-message">
                            <p>Пока что нет загруженных видеороликов.</p>
                        </div>
                    )}
                    {videos.map((video) => (
                        <Card key={video.id} className="mb-4 video-list-card">
                            <Row className="align-items-center">
                                <Col md="auto" className="mx-3">
                                    <Card.Img
                                        variant="top"
                                        className="video-list-thumbnail"
                                        src={video.thumbnail ? `http://localhost:8000${video.thumbnail}` : `http://localhost:8000/media/no_thumbnail.png`}
                                        onClick={() => (window.location.href = `/watch/${video.slug}/`)}
                                    />
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title
                                            className="video-list-title"
                                            onClick={() => (window.location.href = `/watch/${video.slug}/`)}
                                        >
                                            {video.title}
                                        </Card.Title>
                                        <ListGroup horizontal className="justify-content-between">
                                            <ListGroup.Item className="d-flex align-items-center">
                                                {video.processed ? (
                                                    <FaCheckCircle className="mr-2" color="green"/>
                                                ) : (
                                                    <FaSyncAlt className="mr-2" color="orange"
                                                                  onClick={() => handleStartProcessing(video.slug)}/>
                                                )}
                                                <span className='d-block mx-2'>Processed</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="text-center video-list-uploaded-at">
                                                Загружено: {formatDate(video.uploaded_at)}
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-end">
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(video.slug)}
                                                    className="ml-2"
                                                >
                                                    <FaTrashAlt/>
                                                </Button>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Удаление видеоролика</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы уверены, что хотите удалить этот видеоролик?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedVideoId)}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default VideoList;
