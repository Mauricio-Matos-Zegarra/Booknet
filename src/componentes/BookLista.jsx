// src/componentes/BookList.jsx

import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './BookList.css'; // Asegúrate de tener un CSS para estilos personalizados

const BookList = ({ books }) => {

    return (
        <div className="book-list-section">
            <h2 className="section-title">Catálogo de Libros</h2>
            <p className="section-subtitle">{books.length} {books.length === 1 ? 'libro disponible' : 'libros disponibles'}</p>
            <Row xs={1} sm={2} md={3} lg={4} className="g-4"> 
                {books.map(book => (
                    <Col key={book.id}>
                        <Link to={`/detalles/${book.id}`} className="book-card-link text-decoration-none">
                            <Card className="book-card h-100">
                                <Card.Img 
                                    variant="top" 
                                    src={book.portadaURL || 'https://via.placeholder.com/250x350?text=Sin+Portada'}
                                    alt={`Portada de ${book.titulo}`} 
                                />
                                <Card.Body>
                                    <Card.Title className="text-truncate" title={book.titulo}>
                                        {book.titulo}
                                    </Card.Title>
                                    <Card.Text>
                                        <small>{book.autor}</small>
                                    </Card.Text>
                                    <span className="genre-badge">{book.genero}</span>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default BookList;