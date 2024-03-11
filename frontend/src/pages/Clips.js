import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaTools } from 'react-icons/fa';
import '../styles/development.css';
import { useStateContext } from '../contexts/ContextProvider';
import {Footer, Sidebar} from "../components";

const Clips = () => {
  const { currentMode } = useStateContext();

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar />
      <Container fluid className={`main-container d-flex p-0 flex-column ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
        <Container className="main d-flex flex-column align-items-center justify-content-center">
          <Card className={`under-construction-card ${currentMode === 'Light' ? 'under-construction-card-dark' : ''}`}>
            <Card.Body>
              <Row className="justify-content-center mb-4">
                <Col xs={12} md={10} className="d-flex justify-content-center">
                  <FaTools size={64} className={`under-construction-icon ${currentMode === 'Light' ? 'text-light' : 'text-dark'}`} />
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col xs={12} md={10} className="text-center">
                  <h2 className={`under-construction-title ${currentMode === 'Light' ? 'text-light' : 'text-dark'}`}>Страница в разработке!</h2>
                  <p className={`under-construction-text ${currentMode === 'Light' ? 'text-light' : 'text-dark'}`}>Мы усердно работаем над этим.</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
        <Footer />
      </Container>
    </Container>
  );
};

export default Clips;
