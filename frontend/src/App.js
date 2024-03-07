import './App.css';
import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './hooks/auth';
import apiClient from "./Api";

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes apiClient={apiClient}/>
            </AuthProvider>
        </Router>
    );
};

export default App;
