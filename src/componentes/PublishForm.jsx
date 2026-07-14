// src/componentes/PublishForm.jsx
import React, { useState } from 'react';
import { db } from '../firebase'; // Importamos la conexión a Firestore
import { collection, addDoc } from 'firebase/firestore'; // Funciones de Google para añadir datos
import { useNavigate } from 'react-router-dom';

const AVAILABLE_GENRES = [
    'Realismo Mágico', 'Distopía', 'Biografia', 
    'Fantasia', 'Terror'
];

const PublishForm = ({ userId, onPublishSuccess }) => {
    
    // ESTADOS DE LOS CAMPOS DEL FORMULARIO
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState(AVAILABLE_GENRES[0]);
    const [description, setDescription] = useState('');
    const [editorial, setEditorial] = useState(''); 
    const [idioma, setIdioma] = useState(''); 
    
    // ESTADOS PARA LOS ARCHIVOS (Ahora el usuario los puede escribir de nuevo)
    const [pdfPath, setPdfPath] = useState('1984.pdf');
    const [coverPath, setCoverPath] = useState('1984.jpg');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // FUNCIÓN DE ENVÍO (Guardar directo en Firebase NoSQL)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Guardamos el documento directamente en tu colección NoSQL "books" de Google
            await addDoc(collection(db, 'books'), {
                id_usuario: userId, // Tu UID de Firebase
                titulo: title,
                autor: author,
                genero: genre,
                descripcion: description,
                editorial: editorial,
                idioma: idioma,
                // Armamos las rutas usando los nombres que el usuario ingresó en el formulario:
                portadaURL: `/assets/pdfs/${coverPath}`, 
                pdfURL: `/assets/pdfs/${pdfPath}`     
            });

            alert('¡Libro publicado con éxito!');
            navigate('/mis-publicaciones'); 
            
            if (onPublishSuccess) onPublishSuccess(); 

        } catch (err) {
            console.error("Error al guardar en Firestore:", err);
            setError("Error al intentar publicar el libro en Firebase.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="publish-form-container">
            <h2>Publicar un Nuevo Libro</h2>
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
                
                {/* 📂 Campos de archivos simulados visibles nuevamente */}
                <div className="file-simulation-fields" style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
                    <h5 style={{ fontSize: '14px', marginBottom: '10px', color: '#555' }}>Archivos asociados (Simulado local):</h5>
                    <label>Nombre archivo PDF: 
                        <input type="text" value={pdfPath} onChange={(e) => setPdfPath(e.target.value)} required />
                    </label>
                    <label style={{ marginTop: '10px' }}>Nombre archivo Portada: 
                        <input type="text" value={coverPath} onChange={(e) => setCoverPath(e.target.value)} required />
                    </label>
                </div>

                <button type="submit" disabled={loading} className="submit-button" style={{ marginTop: '20px' }}>
                    {loading ? 'Procesando...' : 'Publicar Libro'}
                </button>
            </form>
        </div>
    );
};

export default PublishForm;