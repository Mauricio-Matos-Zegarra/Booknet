// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwZfGCEsln6Kmb-AGlG4s9X2RsM6c0jwI",
  authDomain: "booknet-51952.firebaseapp.com",
  projectId: "booknet-51952",
  storageBucket: "booknet-51952.firebasestorage.app",
  messagingSenderId: "194613288922",
  appId: "1:194613288922:web:be95c17eb12b3e565eae3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar el módulo de autenticación para usar en los formularios
export const auth = getAuth(app);