import React from 'react';
import PropTypes from 'prop-types';

const Background = ({children}) => {
    return (
        <main>
            <div className="position-absolute vh-100 min-vw-100 jumbo opacity-50"></div>
            <div
                className="position-relative flex flex-col vh-100 items-center justify-center bg-transparent dark:bg-black">
                <div
                    className="z-1 d-flex align-items-center justify-content-center relative vh-100 min-vw-100 m-0"
                    style={{zIndex: 1}}>
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
