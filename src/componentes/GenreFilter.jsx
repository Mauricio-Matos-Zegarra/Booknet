// src/componentes/GenreFilter.jsx

import React from 'react';

const GenreFilter = ({ genres, onGenreChange, activeGenre }) => {
    return (
        <div className="genre-filter-container">
            {genres.map(genre => (
                <button
                    key={genre}
                    onClick={() => onGenreChange(genre)}
                    className={`genre-button ${activeGenre === genre ? 'active' : ''}`}
                >
                    {genre}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;