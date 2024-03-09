import React, { useEffect, useState } from 'react';
import client from '../ApiClient';
import { Header, Sidebar, Footer, Dashboard, VideoUploadForm } from "../components";
import { useStateContext } from '../contexts/ContextProvider';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';

const Main = () => {
  const { setCurrentMode, currentMode } = useStateContext();

  useEffect(() => {
    const currentThemeMode = currentMode;
    if (currentThemeMode) {
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentMode]);

  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  }

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar/>
      <Container fluid className={`main-container d-flex p-0 flex-column ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
        <Header handleToggleForm={handleToggleForm} showForm={showForm} />
        <Container className={`main d-flex flex-column align-items-center justify-content-center ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
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
