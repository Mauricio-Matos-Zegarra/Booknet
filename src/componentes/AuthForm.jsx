// src/componentes/AuthForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

// URLs de tu API
const REGISTER_URL = 'https://api-booknet.infinityfreeapp.com/api/register.php';
const LOGIN_URL = 'https://api-booknet.infinityfreeapp.com/api/login.php';

const AuthForm = ({ onAuth, onClose }) => {
  // Estado para alternar entre Login y Registro
  const [isLogin, setIsLogin] = useState(true); 
  
  // Estados para los campos (solo se usan email/password en Login)
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Determinar la URL y los datos a enviar
    const url = isLogin ? LOGIN_URL : REGISTER_URL;
    const dataToSend = isLogin ? { email, password } : { nombre, apellido, email, username: email, password };

    try {
      const response = await axios.post(url, dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // Manejo de respuesta exitosa (Login o Registro)
      if (response.status === 201 || response.status === 200) {
        
        const successMessage = response.data.message;
        const userData = response.data.user; // Si es Login (response.status 200)
        
        alert(successMessage);
        onClose(); // Cerrar el modal

        // Si el login fue exitoso, actualiza el estado del usuario en App.js
        if (isLogin && userData) {
            onAuth(userData); // Pasar el objeto completo del usuario
        }
      }
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Error de red o el servidor PHP no está respondiendo.");
      }
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-form-container">
        <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <button className="close-button" onClick={onClose}>X</button>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">{error}</p>}
          
          {/* Campos de Registro (solo se muestran si isLogin es false) */}
          {!isLogin && (
            <>
              <label>Nombre: <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label>
              <label>Apellido: <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required /></label>
            </>
          )}

          {/* Campo de Correo y Contraseña (Siempre se muestran) */}
          <label>Correo Electrónico: <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Contraseña: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          
          <button type="submit" className="submit-button">{isLogin ? 'Acceder' : 'Registrar Cuenta'}</button>
        </form>
        
        {/* Enlace para alternar entre Login y Registro */}
        <p className="auth-toggle">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
                type="button" 
                className="toggle-button" 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;