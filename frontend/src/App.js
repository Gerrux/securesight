import './App.css';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import {AuthProvider} from './auth/AuthProvider';
import ApiClient from "./ApiClient";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes apiClient={ApiClient}/>
            </AuthProvider>
        </Router>
    );
};

export default App;
