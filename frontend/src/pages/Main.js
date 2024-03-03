import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import Sidebar from '../components/Sidebar';
import { useStateContext } from '../contexts/ContextProvider';

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

  return (
    <Container fluid className="d-flex vh-100 p-0">
      <Sidebar handleLogout/>
      <Container fluid className="main-container bg-light d-flex p-0">
        <h1>Container</h1>
      </Container>
    </Container>
  );
};

export default Main;
