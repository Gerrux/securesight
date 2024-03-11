import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../auth/AuthProvider';
import {Button, Form} from 'react-bootstrap';
import Background from '../components/Layout/Background';
import { ReactComponent as LogoLightSvg } from '../assets/images/logo_light.svg';
import '../styles/auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {register} = useAuth();
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
                <div className="text-center mb-4">
                    <LogoLightSvg className="logo"/>
                    <h1 className="logo-text">SecureSight</h1>
                </div>
                <h2 className="text-center mb-4">Регистрация</h2>
                <Form.Group controlId="username" className='mb-2'>
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        className='w-100'
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="email" className='mb-2'>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        className='w-100'
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="password" className='mb-4'>
                    <Form.Label>Пароль:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        className='w-100'
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </Form.Group>
                <Button variant="dark" type="submit" className="center w-100" block>
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
