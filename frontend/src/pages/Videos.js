import React, {useEffect, useState} from 'react';
import client from '../ApiClient';

import {Header, Sidebar, VideoList, VideoUploadForm} from "../components";
import {useStateContext} from '../contexts/ContextProvider';
import {Container} from 'react-bootstrap';
import '../styles/main.css';

const Videos = () => {

    const {setCurrentColor, setCurrentMode, currentMode} = useStateContext();
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    }
    useEffect(() => {
        const currentThemeColor = localStorage.getItem('colorMode');
        const currentThemeMode = localStorage.getItem('themeMode');
        if (currentThemeColor && currentThemeMode) {
            setCurrentColor(currentThemeColor);
            setCurrentMode(currentThemeMode);
        }
    }, []);

    return (
        <Container fluid className={`d-flex vh-100 p-0 ${currentMode === 'Dark' ? 'main-dark' : ''}`}>
            <Sidebar handleLogout/>
            <Container fluid className="main-container d-flex p-0 flex-column">
                <Header handleToggleForm={handleToggleForm} showForm={showForm}/>
                <Container className="main d-flex flex-column align-items-center justify-content-center">
                    <div className={`container ${showForm ? 'fade-out' : 'fade-in'} ${showForm ? 'd-none' : ''}`}>
                        <VideoList />
                    </div>
                    <div className={`upload-form-container ${showForm ? 'fade-in' : 'fade-out'}`}>
                        {showForm && <VideoUploadForm onClose={handleToggleForm} apiClient={client}/>}
                    </div>
                </Container>
            </Container>
        </Container>
    );
};

export default Videos;
