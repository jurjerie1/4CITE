import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    return (
        <header className="fixed w-full bg-white bg-opacity-95 shadow-md z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <a href="/"><img src={logo} alt="Akkor Hotel Logo" className="h-18 mr-4" /></a>
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-10">
                        <a href="/" className="font-medium hover:text-gold-500 transition-colors">Accueil</a>
                        <a href="#hotels-section" className="font-medium hover:text-gold-500 transition-colors">Réservations</a>
                        </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <a href="/dashboard" className="bg-black text-white px-6 py-2 rounded hover:bg-gold-600 transition-colors">
                                    Tableau de bord
                                </a>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <a href="/login" className="bg-black text-white px-6 py-2 rounded hover:bg-gold-600 transition-colors">
                                Connexion
                            </a>
                        )}
                    </div>

                    <button className="md:hidden">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;