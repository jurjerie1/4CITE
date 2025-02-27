import React from 'react';
import logo from '../assets/logo.png';

const Header: React.FC = () => {
    return (
        <header className="fixed w-full bg-white bg-opacity-95 shadow-md z-50">
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <img src={logo} alt="Akkor Hotel Logo" className="h-18 mr-4" />
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-10">
                        <a href="#" className="font-medium hover:text-gold-500 transition-colors">Accueil</a>
                        <a href="#" className="font-medium hover:text-gold-500 transition-colors">Réservations</a>
                        <a href="#" className="font-medium hover:text-gold-500 transition-colors">Contact</a>
                    </nav>

                    <div className="hidden md:block">
                        <a className="header-button px-6 py-2 rounded hover:bg-gold-600 transition-colors">
                            Connexion
                        </a>
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