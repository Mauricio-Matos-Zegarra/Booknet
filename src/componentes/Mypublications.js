// src/componentes/MyPublications.js
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './MyPublications.css';

const GET_USER_BOOKS_URL = 'https://api-booknet.infinityfreeapp.com/api/get_user_books.php';
const DELETE_BOOK_URL = 'https://api-booknet.infinityfreeapp.com/api/delete_book.php';

const MyPublications = ({ userId, onBookDeleted }) => {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // FUNCIÓN 1: OBTENER LIBROS DEL USUARIO
    const fetchMyBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${GET_USER_BOOKS_URL}?user_id=${userId}`);
            const loadedBooks = Array.isArray(response.data) ? response.data : [];
            setMyBooks(loadedBooks);
        } catch (err) {
            setError("No se pudieron cargar tus publicaciones.");
            setMyBooks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchMyBooks();
        }
    }, [userId, navigate]);


    // FUNCIÓN 2: MANEJAR LA ELIMINACIÓN
    const handleDelete = async (bookId, title) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la publicación: "${title}"? Esta acción es irreversible y eliminará los archivos.`)) {
            return;
        }

        try {
            // Utilizamos axios.post para enviar el body { id, user_id }
            const response = await axios.post(DELETE_BOOK_URL, {
                id: bookId, 
                id_usuario: userId // Crucial para que PHP verifique la propiedad
            });
            
            alert(response.data.message || "Libro eliminado con éxito.");
            
            fetchMyBooks(); // Recargar la lista de Mis Publicaciones
            if (onBookDeleted) {
                onBookDeleted(); // Notificar a App.js para recargar el catálogo general
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error de conexión o permiso.";
            alert("Error al eliminar: " + errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Cargando tus publicaciones...</p>
            </div>
        );
    }

    return (
        <Container className="my-publications-page">
            <div className="page-header">
                <h2>Mis Publicaciones</h2>
                <p>{myBooks.length} {myBooks.length === 1 ? 'libro publicado' : 'libros publicados'}</p>
            </div>
            
            {error && <Alert variant="danger">{error}</Alert>}

            {myBooks.length === 0 && !loading ? (
                <Alert variant="info" className="text-center">
                    Aún no has publicado ningún libro. <Link to="/publicar">Publica uno ahora.</Link>
                </Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {myBooks.map(book => (
                        <Col key={book.id}>
                            <Card className="publication-card h-100">
                                <Card.Img 
                                    variant="top" 
                                    src={book.portadaURL}
                                    alt={book.titulo} 
                                />
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{book.titulo}</Card.Title>
                                    <Card.Text className="mb-auto">
                                        <small className="text-muted">Autor: {book.autor}</small><br/>
                                        <small className="text-muted">Género: {book.genero}</small>
                                    </Card.Text>
                                    <div className="d-flex justify-content-between mt-3">
                                        
                                        {/* Botón ELIMINAR */}
                                        <Button 
                                            variant="danger" 
                                            size="sm" 
                                            onClick={() => handleDelete(book.id, book.titulo)}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyPublications;