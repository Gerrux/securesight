import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import { useStateContext } from '../contexts/ContextProvider';
import '../styles/header.css';

const Header = ({ handleToggleForm, showForm }) => {
  const {currentMode} = useStateContext();

  const buttonText = showForm ? 'Закрыть' : 'Загрузить видео';

  return (
      <Navbar expand="md" className={`${currentMode === 'Dark' ? 'header-dark' : ''}`}>
        <div className='d-flex flex-row-reverse p-0 m-0 w-100 mx-3'>
          <Button size="sm" variant="success" className={`right ${showForm ? 'close-btn' : 'upload-btn'}`} onClick={handleToggleForm}>
            <span>{buttonText}</span>
          </Button>
        </div>
      </Navbar>
  );
};

export default Header;
