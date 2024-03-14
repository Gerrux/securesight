import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/AuthProvider';
import ApiClient from '../ApiClient';
import {Alert, Button, Form, Toast, ToastContainer} from 'react-bootstrap';
import Background from '../components/Layout/Background';
import { ReactComponent as LogoLightSvg } from '../assets/images/logo_light.svg';
import '../styles/auth.css';
import Cookies from "js-cookie";


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get('access');
        if (accessToken) {
            // User is already authenticated, navigate to the appropriate page
            navigate('/');
        }
    }, [navigate]);

    const showErrorToast = (message) => {
      setError(message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await ApiClient.post('/api/login/', {
                username,
                password
            });
            login(response);
            navigate('/');
        } catch (error) {
            console.error(error);
            if (error.message === 'Network Error' && error.request.status === 0) {
                showErrorToast('Сервер недоступен. Пожалуйста, попробуйте позже.');
            } else if (error.response && error.response.status === 500) {
                showErrorToast('Сервер недоступен. Пожалуйста, попробуйте позже.');
            } else {
                showErrorToast('Неверное имя пользователя или пароль');
            }
        }
    };

    return (
        <Background>
            <Form className="p-5 border-light rounded bg-glass card" onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                    <LogoLightSvg className="logo"/>
                    <h1 className="logo-text">SecureSight</h1>
                </div>
                <h2 className="text-center mb-4">Вход</h2>
                <Form.Group controlId="username" className="mb-2">
                    <Form.Label>Никнейм:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        className='w-100'
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password" className="form-outline mb-4">
                    <Form.Label>Пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        className='w-100'
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>
                <Button className="center" variant="dark" type="submit">
                    Войти
                </Button>
                <div className="text-center mt-3">
                    У вас нет аккаунта? <Link to="/register">Регистрация</Link>
                </div>
            </Form>
            <ToastContainer position={'top-center'} className="p-3">
              {error && (
                <Toast onClose={() => setError(null)} dismissible bg={'danger'}>
                  <Toast.Header>
                    <strong className="mr-auto">Ошибка</strong>
                  </Toast.Header>
                  <Toast.Body>{error}</Toast.Body>
                </Toast>
              )}
            </ToastContainer>
        </Background>
    );
};

export default Login;
