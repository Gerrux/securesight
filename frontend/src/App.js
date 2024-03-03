import './App.css';
import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './AppRoutes';


import { useStateContext } from './contexts/ContextProvider';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});


const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();
  return (
    <Router>
      <AppRoutes apiClient={apiClient} />
    </Router>
  );
};

export default App;