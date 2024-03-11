import React, {createContext, useContext, useState} from 'react';

const StateContext = createContext();


export const ContextProvider = ({children}) => {
    const [screenSize, setScreenSize] = useState(undefined);
    const [activeMenu, setActiveMenu] = useState(true);
    const [themeSettings, setThemeSettings] = useState(false);

    const [currentMode, setCurrentMode] = useState(() => {
        const storedMode = localStorage.getItem('themeMode');
        return storedMode ? storedMode : 'Light';
    });

    const [currentColor, setCurrentColor] = useState(() => {
        const storedColor = localStorage.getItem('colorMode');
        return storedColor ? storedColor : '#03C9D7';
    });

    const setMode = (mode) => {
        setCurrentMode(mode);
        localStorage.setItem('themeMode', mode);
    };

    const setColor = (color) => {
        setCurrentColor(color);
        localStorage.setItem('colorMode', color);
    };

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <StateContext.Provider value={{
            currentColor,
            currentMode,
            activeMenu,
            screenSize,
            setScreenSize,
            setActiveMenu,
            setCurrentColor,
            setCurrentMode,
            setMode,
            setColor,
            themeSettings,
            setThemeSettings
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);