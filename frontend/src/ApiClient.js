import axios from 'axios';
import Cookies from "js-cookie";

const ApiClient = axios.create({
    baseURL: 'http://localhost:8000/',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
    withCredentials: true,
});

ApiClient.interceptors.request.use(
    config => {
        const token = Cookies.get('access');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['X-CSRFToken'] = Cookies.get('csrftoken');
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default ApiClient;
