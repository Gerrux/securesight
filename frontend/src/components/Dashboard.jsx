import React, {useEffect, useState} from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';
import ApiClient from '../ApiClient';

const Dashboard = () => {
    const [videoCount, setVideoCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [aiProcessedCount, setAiProcessedCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoResponse = await ApiClient.get('/videos/count/');
                setVideoCount(videoResponse.data.total_videos);

                const userResponse = await ApiClient.get('/api/count/');
                setUserCount(userResponse.data.total_users);

                const processedResponse = await ApiClient.get('/videos/processed/count/');
                setProcessedCount(processedResponse.data.total_processed_videos);

                const aiProcessedResponse = await ApiClient.get('/videos/ai_processed/count/');
                setAiProcessedCount(aiProcessedResponse.data.total_ai_processed_videos);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container fluid className="dashboard-container">
            <Row>
                <Col md={3} className="mb-3">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>Количество видеороликов</Card.Title>
                            <Card.Text>{videoCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>Количество Пользователей</Card.Title>
                            <Card.Text>{userCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>Количество обработанных видеороликов</Card.Title>
                            <Card.Text>{processedCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} className="mb-3">
                    <Card className="dashboard-card">
                        <Card.Body>
                            <Card.Title>Количество обработанных AI видеороликов</Card.Title>
                            <Card.Text>{aiProcessedCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Add more rows and columns as needed */}
        </Container>
    );
};

export default Dashboard;
