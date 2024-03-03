import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import client from '../Api';
import { Container, Form, Button } from 'react-bootstrap'; // import react-bootstrap components
import Background from '../components/Layout/Background';
import '../styles/auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      // User is already authenticated, navigate to the appropriate page
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await client.post('/api/login', {
        username,
        password
      });
      // сохраняем токены в локальное хранилище
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      login(response.data.user);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Background>
      <Form className="p-5 border-light rounded bg-glass card" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Вход</h2>
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
        <Button className="center" variant="dark" type="submit" block>
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
