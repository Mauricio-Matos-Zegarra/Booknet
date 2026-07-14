// src/componentes/MyPublications.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Importamos la base de datos de Firestore
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Funciones de Google para consultar y borrar
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './MyPublications.css';

const MyPublications = ({ userId, onBookDeleted }) => {
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 📡 FUNCIÓN 1: OBTENER LIBROS DEL USUARIO DESDE FIRESTORE
    const fetchMyBooks = async () => {
        setLoading(true);
        setError(null);
        try {
            // Hacemos una consulta rápida NoSQL donde 'id_usuario' coincida con tu UID de Firebase
            const q = query(collection(db, 'books'), where('id_usuario', '==', userId));
            const querySnapshot = await getDocs(q);
            const loadedBooks = [];
            
            querySnapshot.forEach((doc) => {
                // Seteamos los libros emparejando el id único del documento NoSQL de Google
                loadedBooks.push({ id: doc.id, ...doc.data() });
            });
            
            setMyBooks(loadedBooks);
        } catch (err) {
            console.error("Error al cargar publicaciones de Firestore:", err);
            setError("No se pudieron cargar tus publicaciones desde el servidor NoSQL.");
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


    // 🗑️ FUNCIÓN 2: MANEJAR LA ELIMINACIÓN DIRECTA EN FIRESTORE
    const handleDelete = async (bookId, title) => {
        if (!window.confirm(`¿Estás seguro de que deseas eliminar la publicación: "${title}"?`)) {
            return;
        }

        try {
            // Eliminamos el documento directamente en Firestore usando su ID alfanumérico
            await deleteDoc(doc(db, 'books', bookId));
            
            alert("Libro eliminado con éxito.");
            
            fetchMyBooks(); // Recargamos de inmediato la sección local
            
            if (onBookDeleted) {
                onBookDeleted(); // Notificamos a App.js para que también actualice el catálogo de inicio
            }

        } catch (err) {
            console.error("Error al eliminar documento de Firestore:", err);
            alert("Error al intentar eliminar el libro de Firebase.");
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