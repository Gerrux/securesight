import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthProvider';
import { Form, Button } from 'react-bootstrap';
import Background from '../components/Layout/Background';
import '../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Background>
      <Form className="p-5 border-light rounded bg-white" onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">Регистрация</h2>
        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email:</Form.Label>
          <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Пароль:</Form.Label>
          <Form.Control
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="center" block>
          Зарегистрироваться
        </Button>
        <div className="text-center mt-3">
          У вас уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </Form>
    </Background>
  );
};

export default Register;
