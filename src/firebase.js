// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAwZfGCEsln6Kmb-AGlG4a9X2RaM5c8jwI",
    authDomain: "booknet-51952.firebaseapp.com",
    projectId: "booknet-51952",
    storageBucket: "booknet-51952.firebasestorage.app",
    messagingSenderId: "194613288922",
    appId: "1:194613288922:web:be95c17eb12b3e565eeae3"
  };

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar el módulo de autenticación para usar en los formularios
export const auth = getAuth(app);