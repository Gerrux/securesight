import './App.css';
import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './hooks/AuthProvider';
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
