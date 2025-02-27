import React from 'react';

const Header: React.FC = () => {
    return (
        <header style={{ padding: '1em', backgroundColor: '#646cff', color: 'white', textAlign: 'center' }}>
            <h1>Akkor Hotel</h1>
            <nav>
                <a href="#home" style={{ margin: '0 1em', color: 'white' }}>Home</a>
                <a href="#about" style={{ margin: '0 1em', color: 'white' }}>About</a>
                <a href="#contact" style={{ margin: '0 1em', color: 'white' }}>Contact</a>
            </nav>
        </header>
    );
};

export default Header;