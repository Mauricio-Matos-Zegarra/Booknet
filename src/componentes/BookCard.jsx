// src/components/BookCard.jsx

import React from 'react';

// Recibe 'book' y 'onSelect' (la función que viene de App.js)
const BookCard = ({ book, onSelect }) => {
  
  const handleClick = () => {
    onSelect(book); // Llama a la función 'onSelect' pasándole el libro actual
  };
  
  return (
    // Agrega el evento onClick al div principal
    <div className="book-card" onClick={handleClick}> 
      <img 
        src={book.portadaURL} 
        alt={`Portada de ${book.titulo}`} 
        className="book-cover"
        // Asegúrate de que las URLs de las imágenes sean correctas
        // style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
      />
      <div className="book-info">
        <h3>{book.titulo}</h3>
        <p>Autor: **{book.autor}**</p>
      </div>
    </div>
  );
};

export default BookCard;