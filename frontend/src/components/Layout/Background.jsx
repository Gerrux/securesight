import React from 'react';
import PropTypes from 'prop-types';
import {useStateContext} from "../../contexts/ContextProvider";
const Background = ({children}) => {
    const {currentMode} = useStateContext();
    return (
        <main className={`${currentMode === 'Dark' ? 'dark' : ''}`}>
            <div className="vh-100 min-vw-100 jumbo opacity-50"></div>
            <div
                className="position-absolute top-0 z-1 flex flex-col vh-100 items-center justify-center">
                <div
                    className="d-flex align-items-center justify-content-center relative vh-100 min-vw-100 m-0">
                    {children}
                </div>
            </div>
        </main>


    );
};

Background.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Background;
