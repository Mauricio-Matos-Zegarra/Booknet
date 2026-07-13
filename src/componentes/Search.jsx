// src/components/Search.jsx

import React from 'react';

const Search = ({ onSearchChange, searchTerm }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Buscar libros por título o autor..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)} // Llama a la función del padre con el nuevo valor
        className="search-input"
      />
    </div>
  );
};

export default Search;