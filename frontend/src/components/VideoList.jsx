import React, {useEffect, useRef, useState} from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import ApiClient from '../ApiClient';
import {Button, Card, Col, ListGroup, Modal, OverlayTrigger, Row, Spinner, Tooltip} from 'react-bootstrap';
import {FaCheckCircle, FaPlay, FaRobot, FaSyncAlt, FaTrashAlt} from 'react-icons/fa';
import formatDateString from '../utils/formatDate';
import '../styles/video_list.css';

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedVideoId, setSelectedVideoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const loadingRef = useRef(null);

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
            if (loadingRef.current) {
              loadingRef.current.classList.add('fade-out');
            }
          }
        };

        fetchVideos();
    }, []);


    const handleDelete = async (slug) => {
        try {
            await ApiClient.delete(`/videos/${slug}/`);
            setVideos(videos.filter((video) => video.slug !== slug));
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartAIProcessing = async (slug) => {
        try {
          await ApiClient.post(`/videos/${slug}/ai_process/`);
          setVideos(
            videos.map((video) =>
              video.slug === slug ? { ...video, ai_processed: true } : video
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
            <Spinner className="loading-spinner" ref={loadingRef} animation="border" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </Spinner>
          </div>
        );
    }

    return (
        <div className="fade-in">
            <Row className="mb-4">
              <Col>
                <h1 className="video-list-title">
                  Загружено видеороликов: {videos.length}
                </h1>
              </Col>
            </Row>
            <Row>
                <Col>
                    {videos.length === 0 && !loading && (
                        <div className="text-center no-videos-message">
                            <p>Пока что нет загруженных видеороликов.</p>
                        </div>
                    )}
                    <Scrollbars style={{ height: 800, color: "blue"}} autoHide>
                    {videos.map((video) => (
                        <Card key={video.id} className="mb-4 video-list-card mx-2">
                            <Row className="align-items-center">
                                <Col md="auto" className="mx-3">
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip id={`tooltip-bottom`}>Play Video</Tooltip>}
                                    >
                                        <div className="thumbnail-container" onClick={() => (window.location.href = `/watch/${video.slug}/`)}>
                                            <Card.Img
                                                variant="top"
                                                className="video-list-thumbnail rounded"
                                                src={video.thumbnail ? `http://localhost:8000${video.thumbnail}` : `http://localhost:8000/media/no_thumbnail.png`}
                                            />
                                            <div className="play-icon">
                                                <FaPlay />
                                            </div>
                                        </div>
                                    </OverlayTrigger>
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <Card.Title
                                            className="video-title"
                                            onClick={() => (window.location.href = `/watch/${video.slug}/`)}
                                        >
                                            {video.title}
                                        </Card.Title>
                                        <ListGroup horizontal className="justify-content-between">
                                            <ListGroup.Item className="video-list-uploaded-at border-0 px-0">
                                                {formatDateString(video.uploaded_at)}
                                            </ListGroup.Item>
                                            <ListGroup.Item className="border-0 px-0">
                                                <ListGroup horizontal className="justify-content-end">

                                            <ListGroup.Item className="d-flex align-items-center border-0">
                                                {video.processed ? (
                                                        <>
                                                            <FaCheckCircle className="mr-2" color="green"/>
                                                            <span className='d-block mx-2'>Обработано</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FaSyncAlt className="mr-2" color="orange"/>
                                                            <span className='d-block mx-2'>Обрабатывается</span>
                                                        </>
                                                    )}

                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex align-items-center border-0">
                                                {video.ai_processed ? (
                                                    <>
                                                        <FaRobot className="" color="green"/>
                                                        <span className="d-block mx-2">Обработано AI</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRobot className="mr-2" color="red"/>
                                                        <span className="d-block mx-2">Необработано AI</span>
                                                    </>
                                                )}

                                                {video.ai_processed ? (
                                                <></>
                                                    ) : (<Button
                                                      variant="success"
                                                      size="sm"
                                                      onClick={() => handleStartAIProcessing(video.slug)}
                                                      className="ml-2"
                                                    >
                                                      AI Start
                                                </Button>)
                                                }
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-end border-0">
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
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                    </Scrollbars>
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
