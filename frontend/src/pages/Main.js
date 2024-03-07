import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import Sidebar from '../components/Sidebar';
import { useStateContext } from '../contexts/ContextProvider';
import Header from "../components/Header";
import Footer from "../components/Footer";
import VideoUploadForm from '../components/VideoUploadForm';
import Dashboard from "../components/Dashboard";
import client from '../Api';

const Main = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  }

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar/>
      <Container fluid className="main-container bg-light d-flex p-0 flex-column">
        <Header handleToggleForm={handleToggleForm} showForm={showForm} />
        <Container className="main d-flex flex-column align-items-center justify-content-center">
          <div className={`dashboard-container ${showForm ? 'fade-out' : 'fade-in'}`}>
            {!showForm && <Dashboard/>}
          </div>
          <div className={`upload-form-container ${showForm ? 'fade-in' : 'fade-out'}`}>
            {showForm && <VideoUploadForm onClose={handleToggleForm} apiClient={client} />}
          </div>
        </Container>
        <Footer/>
      </Container>
    </Container>
  );
};

export default Main;
