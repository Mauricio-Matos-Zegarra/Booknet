// src/componentes/AuthForm.jsx

import React, { useState } from 'react';
import { auth } from '../firebase'; // Importamos la conexión a Firebase
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

const AuthForm = ({ onAuth, onClose }) => {
  // Estado para alternar entre Login y Registro
  const [isLogin, setIsLogin] = useState(true); 
  
  // Estados para los campos
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // =========================================================================
        // 🔑 LOGUEAR USUARIO CON FIREBASE
        // =========================================================================
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Simulamos la estructura de objeto que espera tu App.js
        const userData = {
          id: user.uid,
          nombre: user.displayName ? user.displayName.split(' ')[0] : 'Usuario',
          apellido: user.displayName ? user.displayName.split(' ')[1] || '' : '',
          email: user.email
        };

        alert("¡Inicio de sesión exitoso!");
        onClose(); // Cerrar modal
        onAuth(userData); // Actualizar el estado en App.js

      } else {
        // =========================================================================
        // 📝 REGISTRAR USUARIO CON FIREBASE
        // =========================================================================
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardamos el Nombre y Apellido en el perfil de Firebase para no perderlos
        await updateProfile(user, {
          displayName: `${nombre} ${apellido}`
        });

        alert("¡Usuario registrado con éxito!");
        
        // Pasamos automáticamente al login del usuario recién creado
        const userData = {
          id: user.uid,
          nombre: nombre,
          apellido: apellido,
          email: user.email
        };
        
        onClose(); // Cerrar modal
        onAuth(userData); // Loguearlo automáticamente en App.js
      }
      
    } catch (err) {
      // Traducir los errores de Firebase al español para que queden prolijos
      console.error(err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('El correo electrónico ya está registrado.');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres.');
          break;
        case 'auth/invalid-email':
          setError('El formato del correo electrónico no es válido.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Correo o contraseña incorrectos.');
          break;
        default:
          setError('Ocurrió un error en la autenticación. Reintentá.');
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