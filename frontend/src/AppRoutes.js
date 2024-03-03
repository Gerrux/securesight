import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './pages/Main';
import Videos from './pages/Videos';
import { useAuth } from './hooks/auth';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  const routes = useRoutes([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/',
      element: isAuthenticated ? <Main /> : <Navigate to="/login" replace />
    },
    {
      path: '/videos',
      element: isAuthenticated ? <Videos /> : <Navigate to="/login" replace />
    }
  ]);

  return routes;
};

export default AppRoutes;