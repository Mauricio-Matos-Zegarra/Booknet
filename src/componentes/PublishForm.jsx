// src/componentes/PublishForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// URLs de tu API
const CREATE_URL = 'https://api-booknet.infinityfreeapp.com/api/publish_book.php';
const UPDATE_URL = 'https://api-booknet.infinityfreeapp.com/api/update_book.php';
const GET_BOOK_URL = 'https://api-booknet.infinityfreeapp.com/api/get_book_by_id.php'; 

const AVAILABLE_GENRES = [
    'Realismo Mágico', 'Distopía', 'Biografia', 
    'Fantasia', 'Terror'
];

const PublishForm = ({ userId, onPublishSuccess }) => {
    
    const { bookId } = useParams(); 
    const isEditing = !!bookId;
    
    // ESTADOS DE LOS CAMPOS DEL FORMULARIO
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState(AVAILABLE_GENRES[0]);
    const [description, setDescription] = useState('');
    const [editorial, setEditorial] = useState(''); 
    const [idioma, setIdioma] = useState(''); 
    
    // TRUCO CLAVE: Cambiamos de archivo físico a strings de texto simulados para evitar que InfinityFree falle
    const [pdfPath, setPdfPath] = useState('1984.pdf');
    const [coverPath, setCoverPath] = useState('1984.jpg');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // 1. EFECTO PARA CARGAR DATOS EN MODO EDICIÓN
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            axios.get(`${GET_BOOK_URL}?id=${bookId}`)
                .then(response => {
                    const bookData = response.data;
                    setTitle(bookData.titulo || '');
                    setAuthor(bookData.autor || '');
                    setGenre(bookData.genero || AVAILABLE_GENRES[0]);
                    setDescription(bookData.descripcion || '');
                    setEditorial(bookData.editorial || '');
                    setIdioma(bookData.idioma || '');
                })
                .catch(err => {
                    console.error("Error al cargar datos del libro:", err);
                    setError("No se pudo cargar el libro para edición.");
                    navigate('/mis-publicaciones'); 
                })
                .finally(() => setLoading(false));
        }
    }, [bookId, isEditing, navigate]);

    // 2. FUNCIÓN DE ENVÍO (Manejar CREAR o ACTUALIZAR)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (!isEditing && (!pdfPath || !coverPath)) {
             setError("Debes rellenar el nombre del archivo PDF y de la portada.");
             setLoading(false);
             return;
        }

        const url = isEditing ? UPDATE_URL : CREATE_URL;
        const formData = new FormData();
        
        // Añadir todos los campos de texto normales
        formData.append('id_usuario', userId); 
        formData.append('titulo', title);
        formData.append('autor', author);
        formData.append('genero', genre);
        formData.append('descripcion', description);
        formData.append('editorial', editorial);
        formData.append('idioma', idioma);
        
        if (isEditing) {
            formData.append('id', bookId);
        }

        // TRUCO: Le mandamos strings simulados en lugar de los archivos binarios reales
        // De esta forma tu PHP los recibe como texto, los guarda en la BD, ¡e InfinityFree no se queja!
        formData.append('pdf_file_simulated', pdfPath);
        formData.append('cover_file_simulated', coverPath);

        try {
            const response = await axios.post(url, formData); 

            if (response.status === 201 || response.status === 200) {
                alert(`Libro ${isEditing ? 'actualizado' : 'publicado'} con éxito.`);
                navigate('/mis-publicaciones'); 
                if (onPublishSuccess) onPublishSuccess(); 
            }

        } catch (err) {
            const msg = err.response?.data?.message || "Error de red o servidor.";
            setError("Error: " + msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) return <div className="text-center my-5">Cargando datos para edición...</div>;

    return (
        <div className="publish-form-container">
            <h2>{isEditing ? `Editar: ${title}` : 'Publicar un Nuevo Libro'}</h2>
            {error && <p className="form-error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Título: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
                <label>Autor: <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required /></label>
                <label>Editorial: <input type="text" value={editorial} onChange={(e) => setEditorial(e.target.value)} required /></label>
                <label>Idioma: <input type="text" value={idioma} onChange={(e) => setIdioma(e.target.value)} required /></label>

                <label>
                    Género:
                    <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
                        {AVAILABLE_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>
                
                <label>Descripción: <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required></textarea></label>

                {/* MODIFICACIÓN VISUAL: Inputs de texto simples que cargan por defecto "1984.pdf" y "1984.jpg" */}
                {!isEditing && (
                    <>
                        <label>Nombre archivo PDF (Simulado): <input type="text" value={pdfPath} onChange={(e) => setPdfPath(e.target.value)} required /></label>
                        <label>Nombre archivo Portada (Simulado): <input type="text" value={coverPath} onChange={(e) => setCoverPath(e.target.value)} required /></label>
                    </>
                )}
                
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Procesando...' : (isEditing ? 'Guardar Cambios' : 'Publicar Libro')}
                </button>
            </form>
        </div>
    );
};

export default PublishForm;