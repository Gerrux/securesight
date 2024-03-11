import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/AuthProvider';
import ApiClient from '../ApiClient';
import {Alert, Button, Form} from 'react-bootstrap';
import Background from '../components/Layout/Background';
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
            setError('Invalid username or password');
        }
    };

    return (
        <Background>
            <Form className="p-5 border-light rounded bg-glass card" onSubmit={handleSubmit}>
                <h2 className="text-center mb-4">Вход</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group controlId="username" className="mb-2">
                    <Form.Label>Никнейм:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password" className="form-outline mb-2">
                    <Form.Label>Пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
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
        </Background>
    );
};

export default Login;
