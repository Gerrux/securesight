import axios from 'axios';
import { useAuth } from './hooks/auth';
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/',
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;
