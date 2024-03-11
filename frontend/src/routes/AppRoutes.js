import React from 'react';
import {useRoutes} from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Main from '../pages/Main';
import Videos from '../pages/Videos';
import VideoDetail from '../pages/VideoDetail'
import Clips from '../pages/Clips'
import PrivateRoute from "./PrivateRoute";


const AppRoutes = () => {
  return useRoutes([
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/watch/:slug',
      element: <VideoDetail />
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          path: '/',
          element: <Main />
        },
        {
          path: '/videos',
          element: <Videos />
        },
        {
          path: '/clips',
          element: <Clips />
        }

      ]
    }
  ]);
};

export default AppRoutes;