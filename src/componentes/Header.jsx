// src/components/Header.jsx

import React from 'react';

// AÑADIDO: Recibe la nueva prop onPublishClick
const Header = ({ isAuthenticated, username, onLoginClick, onLogout, onPublishClick }) => {
    return (
        <header className="header-container">
            <h1 className="logo">Mi Librería Digital 📖</h1>
            <nav className="nav-links">
                {isAuthenticated ? (
                    // Vista de Usuario Logueado
                    <>
                        {/* BOTÓN DE PUBLICACIÓN (AÑADIDO) */}
                        <button 
                            onClick={onPublishClick} 
                            className="header-button publish-button"
                            style={{ marginRight: '15px', backgroundColor: '#2ecc71' }} // Puedes ajustar los estilos en App.css
                        >
                            Publicar Libro
                        </button>

                        <span style={{ marginRight: '10px' }}>Bienvenido, **{username}**</span>
                        <button onClick={onLogout} className="header-button logout-button">
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    // Vista de Usuario NO Logueado
                    <button onClick={onLoginClick} className="header-button login-button">
                        Iniciar Sesión / Registrarse
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;