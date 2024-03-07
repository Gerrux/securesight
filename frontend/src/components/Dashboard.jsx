import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Videos</Card.Title>
              <Card.Text>123</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>456</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Views</Card.Title>
              <Card.Text>789</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <Card.Title>Total Likes</Card.Title>
              <Card.Text>1011</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Add more rows and columns as needed */}
    </Container>
  );
};

export default Dashboard;
