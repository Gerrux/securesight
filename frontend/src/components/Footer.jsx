import React from 'react';
import { Container } from 'react-bootstrap';
import {useStateContext} from "../contexts/ContextProvider";

const Footer = () => {
  const { currentMode } = useStateContext();
  return (
    <footer className={`${currentMode === 'Dark' ? 'footer-dark' : ''}`}>
      <Container>
        <p className="text-center">
          Copyright &copy; SecureSight {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
