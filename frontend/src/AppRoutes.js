import React from 'react';
import {Navigate, useRoutes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Videos from './pages/Videos';
import {useAuth} from './hooks/auth';

const AppRoutes = ({ apiClient }) => {
  const { isAuthenticated } = useAuth();

  return useRoutes([
    {
      path: '/login',
      element: <Login apiClient={apiClient} />
    },
    {
      path: '/register',
      element: <Register apiClient={apiClient} />
    },
    {
      path: '/',
      element: isAuthenticated ? <Main/> : <Navigate to="/login" replace/>
    },
    {
      path: '/videos',
      element: isAuthenticated ? <Videos/> : <Navigate to="/login" replace/>
    }
  ]);
};

export default AppRoutes;