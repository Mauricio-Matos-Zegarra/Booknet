// src/App.js

import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import axios from 'axios';

// Importación de Componentes
// El Header fue eliminado ya que usas Navbar de Bootstrap
import Footer from './componentes/Footer.jsx'; // <-- IMPORTACIÓN NECESARIA
import BookList from './componentes/BookLista.jsx';
import AuthForm from './componentes/AuthForm.jsx';
import Search from './componentes/Search.jsx';
import initialBooks from './data/books.js'; 
import BookDetails from './componentes/BookDetails.jsx';
import GenreFilter from './componentes/GenreFilter.jsx';
import PublishForm from './componentes/PublishForm.jsx';
import MyPublications from './componentes/Mypublications.js'; 
import './App.css'; 


// URLS y Constantes
const GET_BOOKS_URL = 'https://api-booknet.infinityfreeapp.com/api/get_books.php';

const AVAILABLE_GENRES = [
    'Todos',
    'Realismo Mágico',
    'Distopía',
    'Biografia',
    'Fantasia',
    'Terror',
];

function App() {

  // ESTADOS PRINCIPALES
    const [books, setBooks] = useState([]); 
    const [loadingBooks, setLoadingBooks] = useState(true); 

 // ESTADOS DE AUTENTICACIÓN Y VISTAS
    const [user, setUser] = useState(null); 
    const [showAuth, setShowAuth] = useState(false); 
  
  // ESTADOS DE FILTRADO
    const [searchTerm, setSearchTerm] = useState(''); 
    const [selectedGenre, setSelectedGenre] = useState('Todos'); 

useEffect(() => {
    // 1. Intentar obtener el usuario guardado en localStorage
    const storedUser = localStorage.getItem('userSession');
    
    if (storedUser) {
        try {
            // 2. Si existe, convertir el string JSON de vuelta a objeto
            const userData = JSON.parse(storedUser);
            
            // 3. Restaurar el estado 'user' de React
            setUser(userData); 
        } catch (e) {
            // Manejar errores de datos corruptos o inválidos
            console.error("Error al recuperar el usuario de localStorage:", e);
            localStorage.removeItem('userSession'); 
        }
    }
}, []);    


 // =========================================================
 // 1. FUNCIONES CENTRALES
 // =========================================================

    // FUNCIÓN PARA OBTENER LIBROS DEL SERVIDOR
    const fetchBooks = async () => {
        setLoadingBooks(true);
        try {
            const response = await axios.get(GET_BOOKS_URL);
            
            if (response.status === 200 && Array.isArray(response.data)) {
                const publishedBooks = response.data;
                const combinedBooks = [...initialBooks, ...publishedBooks];
                setBooks(combinedBooks);
            }
        } catch (error) {
            console.error("Error al obtener libros del servidor:", error);
            setBooks(initialBooks); 
        } finally {
            setLoadingBooks(false);
        }
    };
    
    // FUNCIÓN DE ÉXITO DE PUBLICACIÓN (Recarga la lista)
    const handlePublishSuccess = () => {
        fetchBooks();
        alert("¡Tu libro ha sido publicado y está pendiente de revisión!"); 
    };

    // FUNCIÓN DE AUTENTICACIÓN (LOGIN)
    const handleLogin = (userData) => {
        setUser(userData); 
        localStorage.setItem('userSession', JSON.stringify(userData));
    setShowAuth(false);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('userSession');
    alert("Sesión cerrada.");
    };


    // LÓGICA DE FILTRADO
    const filteredBooks = useMemo(() => {
        let currentBooks = books; 

        if (selectedGenre !== 'Todos') {
            currentBooks = currentBooks.filter(book => book.genero === selectedGenre);
        }

        if (searchTerm) {
            const lowerCaseTerm = searchTerm.toLowerCase();
            currentBooks = currentBooks.filter(book => 
                book.titulo.toLowerCase().includes(lowerCaseTerm) ||
                book.autor.toLowerCase().includes(lowerCaseTerm)
            );
        }
        return currentBooks;
    }, [searchTerm, selectedGenre, books]); 


  // 2. EFECTO: CARGAR LIBROS AL MONTAR EL COMPONENTE
  useEffect(() => {
    fetchBooks();
  }, []);


  const isAuthenticated = user !== null;

    // COMPONENTE INLINE PARA LA VISTA PRINCIPAL (CATÁLOGO)
    const HomeView = () => (
        <>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Descubre tu próxima <span>lectura</span></h1>
                    <p>Explora nuestro catálogo digital y encuentra libros de todos los géneros.</p>
                </div>
            </section>

            <section className="catalog-section">
                <Container>
                    {loadingBooks && (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando catálogo...</p>
                        </div>
                    )}

                    {!loadingBooks && (
                        <>
                            <GenreFilter 
                                genres={AVAILABLE_GENRES} 
                                onGenreChange={setSelectedGenre} 
                                activeGenre={selectedGenre}
                            />
                            <Search onSearchChange={setSearchTerm} searchTerm={searchTerm} />
                        </>
                    )}

                    {!loadingBooks && filteredBooks.length > 0 ? (
                        <BookList books={filteredBooks} />
                    ) : (
                        !loadingBooks && (
                            <div className="empty-state">
                                <p>
                                    No se encontraron resultados
                                    {searchTerm && ` para "${searchTerm}"`}
                                    {selectedGenre !== 'Todos' && ` en la categoría "${selectedGenre}"`}.
                                </p>
                            </div>
                        )
                    )}
                </Container>
            </section>
        </>
    );

    return (
        <Router>
            <div className="App">
                
                {/* NAVBAR de Bootstrap */}
                <Navbar className="app-navbar" expand="lg" sticky="top">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Book<span>Net</span></Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/">Catálogo</Nav.Link>
                                
                                {/* Botones visibles solo si está autenticado */}
                                {isAuthenticated && (
                                    <>
                                        <Nav.Link as={Link} to="/publicar">Publicar Libro</Nav.Link>
                                        <Nav.Link as={Link} to="/mis-publicaciones">Mis Publicaciones</Nav.Link>
                                    </>
                                )}
                            </Nav>

                            {/* Botones de Login/Logout */}
                            <Nav>
                                {isAuthenticated ? (
                                    <Nav.Item className="d-flex align-items-center gap-2">
                                        <span className="user-greeting">Bienvenido, <strong>{user.nombre}</strong></span>
                                        <button onClick={handleLogout} className="btn btn-nav-logout btn-sm">Cerrar Sesión</button>
                                    </Nav.Item>
                                ) : (
                                    <button onClick={() => setShowAuth(true)} className="btn btn-nav-login btn-sm">
                                        Iniciar Sesión
                                    </button>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                
                {/* Modal de Autenticación */}
                {showAuth && (
                    <AuthForm onAuth={handleLogin} onClose={() => setShowAuth(false)} />
                )}
                
                {/* DEFINICIÓN DE RUTAS */}
                <Routes>
                    
                    {/* RUTA PRINCIPAL (CATÁLOGO + FILTRO) */}
                    <Route path="/" element={<HomeView />} />
                    
                    {/* RUTA DE PUBLICACIÓN */}
                    <Route path="/publicar" element={
                        isAuthenticated ? (
                            <PublishForm 
                                userId={user.id} 
                                onPublishSuccess={handlePublishSuccess} 
                            />
                        ) : (
                            <div className="auth-required">
                                <p>Por favor, <Link to="#" onClick={() => setShowAuth(true)}>inicia sesión</Link> para publicar un libro.</p>
                            </div>
                        )
                    } />
                    
                    {/* RUTA DE MIS PUBLICACIONES */}
                    <Route path="/mis-publicaciones" element={
                        isAuthenticated ? (
                            <MyPublications 
                            userId={user.id} 
                            onBookDeleted={fetchBooks}/>
                        ) : (
                            <div className="auth-required">
                                <p>Debes <Link to="#" onClick={() => setShowAuth(true)}>iniciar sesión</Link> para ver tus publicaciones.</p>
                            </div>
                        )
                    } />
                    
                    {/* RUTA DE DETALLES */}
                    <Route path="/detalles/:bookId" element={
                        <BookDetails 
                            books={books} 
                            isAuthenticated={isAuthenticated} 
                            // Aquí puedes pasar fetchBooks si BookDetails necesita recargar algo
                        />
                    } />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;