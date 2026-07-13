// src/componentes/BookDetails.jsx

import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
// Nota: Se asume que react-icons está comentado o instalado. Usamos emojis como fallback.
import './BookDetails.css'; 

// El componente recibe el array completo 'books' del estado de App.js
const BookDetails = ({ books, isAuthenticated }) => {
    
    const { bookId } = useParams();

    // 1. Buscar el libro en el array (CRÍTICO: Usa la comparación estricta de string)
    const book = useMemo(() => {
        if (!books) return null;
        // Se busca el libro cuyo ID (convertido a string) coincida exactamente con el ID de la URL.
        return books.find(b => String(b.id) === String(bookId)); 
    }, [books, bookId]);

    // Si el libro no se encuentra, muestra un error 404
    if (!book) {
        return (
            <Container className="book-not-found">
                <h2>Libro no encontrado</h2>
                <p>El libro con ID <strong>{bookId}</strong> no existe en el catálogo.</p>
                <Link to="/" className="btn btn-nav-login">Volver al Catálogo</Link>
            </Container>
        );
    }
    
    // 2. Definición de la URL de Descarga
    // book.linkDescarga debe contener la URL completa (ej: https://api-booknet.infinityfreeapp.com/...)
    // Si no existe, usamos '#' para disparar el alert en la función.
    const downloadURL = book.linkDescarga || '#'; 


    // Función para manejar la descarga (para prevenir la acción si la ruta es inválida)
    const handleDownload = (e) => {
        // CORRECCIÓN CLAVE: Ahora valida tanto localhost como el dominio real de InfinityFree
        const esInvalidoLocal = downloadURL.includes('http://localhost/') && downloadURL.length < 30;
        const esInvalidoNube = downloadURL.includes('api-booknet.infinityfreeapp.com') && downloadURL.length < 55;

        if (downloadURL === '#' || esInvalidoLocal || esInvalidoNube) {
            e.preventDefault(); // Previene que el <a> haga la acción
            alert('Ruta del PDF no disponible. (El archivo puede no haberse subido correctamente).');
            return;
        }
    };

    return (
        <Container className="book-details mt-5">
            <Card className="shadow-lg p-4">
                <Card.Body>
                    {/* Botón para volver al catálogo */}
                    <Link to="/" className="btn btn-back mb-4">
                        ← Volver al Catálogo
                    </Link>

                    <h1>{book.titulo}</h1>
                    <h2>Por {book.autor}</h2>
                    
                    <hr />

                    {/* INFORMACIÓN DETALLADA */}
                    <div className="book-metadata mb-4">
                        <p><strong>📚 Género:</strong> {book.genero}</p>
                        {/* Se muestran solo si el campo existe en el objeto */}
                        {book.editorial && <p><strong>🏢 Editorial:</strong> {book.editorial}</p>}
                        {book.idioma && <p><strong>🌐 Idioma:</strong> {book.idioma}</p>}
                        {book.fechaPublicacion && <p><strong>📅 Fecha de Publicación:</strong> {book.fechaPublicacion}</p>}
                        {book.paginas && <p><strong>📄 Páginas:</strong> {book.paginas}</p>}
                        
                        <h3>Sinopsis</h3>
                        <p className="lead book-description">{book.resumen}</p>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                        
                        {/* LÓGICA DE DESCARGA */}
                        {isAuthenticated ? (
                            <a 
                                href={downloadURL}
                                onClick={handleDownload} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                download={`${book.titulo}.pdf`}
                                className="btn btn-lg btn-success action-button download-button"
                            >
                                ⬇️ Descargar PDF
                            </a>
                        ) : (
                            // Mensaje No Logueado
                            <p className="login-required-message m-0">
                                Debes iniciar sesión para descargar este libro.
                            </p>
                        )}
                    </div>

                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookDetails;