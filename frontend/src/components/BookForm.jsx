// frontend/src/components/BookForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_LIVROS = 'http://localhost:3001/livros';
const API_AUTORES = 'http://localhost:3001/autores'; // Para buscar a lista de autores

function BookForm() {
    const [titulo, setTitle] = useState('');
    const [isbn, setIsbn] = useState('');
    const [anoPublicacao, setAnoPublicacao] = useState('');
    const [autorId, setAutorId] = useState(''); // Chave estrangeira
    const [autores, setAutores] = useState([]); // Lista de autores para o select

    const [loadingForm, setLoadingForm] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); 

    const isEditing = !!id;

    useEffect(() => {
        fetchAutores();
        if (isEditing) {
            fetchBook(id);
        } else {
            setLoadingForm(false);
        }
    }, [id, isEditing]);

    // Busca a lista de autores para o dropdown (SELECT)
    const fetchAutores = async () => {
        try {
            const response = await axios.get(API_AUTORES);
            setAutores(response.data);
            // Define o primeiro autor como padrão se for uma nova criação
            if (response.data.length > 0 && !isEditing) {
                setAutorId(response.data[0].id);
            }
        } catch (err) {
            console.error("Erro ao carregar autores:", err);
            alert("Não foi possível carregar a lista de autores. Verifique o Backend.");
        }
    };

    // Carrega dados do livro para edição
    const fetchBook = async (bookId) => {
        try {
            const response = await axios.get(`${API_LIVROS}/${bookId}`);
            setTitle(response.data.titulo);
            setIsbn(response.data.isbn || '');
            setAnoPublicacao(response.data.ano_publicacao || '');
            setAutorId(response.data.autor_id || '');
            setLoadingForm(false);
        } catch (err) {
            alert('Erro ao carregar dados do livro para edição. Redirecionando...');
            navigate('/livros');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação simples do ano
        const anoPubNum = anoPublicacao ? parseInt(anoPublicacao, 10) : null;
        if (anoPublicacao && (isNaN(anoPubNum) || anoPubNum.toString().length !== 4)) {
            alert("Por favor, insira um ano de publicação válido (4 dígitos).");
            return;
        }

        // Garante que o autor_id é um número
        const selectedAutorId = parseInt(autorId, 10);

        const bookData = { 
            titulo, 
            isbn: isbn || null, 
            ano_publicacao: anoPubNum, 
            autor_id: selectedAutorId 
        };

        try {
            if (isEditing) {
                await axios.put(`${API_LIVROS}/${id}`, bookData);
                alert('Livro atualizado com sucesso!');
            } else {
                await axios.post(API_LIVROS, bookData);
                alert('Livro criado com sucesso!');
            }
            navigate('/livros'); 
        } catch (err) {
            console.error("Erro ao salvar:", err);
            alert(err.response?.data?.message || 'Erro ao salvar o livro. Tente novamente.'); 
        }
    };

    if (loadingForm) return <p>Carregando formulário...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? '✏️ Editar Livro' : '✨ Novo Livro'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="titulo">Título (Obrigatório):</label>
                    <input
                        id="titulo"
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="autor">Autor (Obrigatório):</label>
                    {autores.length > 0 ? (
                        <select
                            id="autor"
                            value={autorId}
                            onChange={(e) => setAutorId(e.target.value)}
                            required
                        >
                            <option value="">Selecione um Autor</option>
                            {autores.map((autor) => (
                                <option key={autor.id} value={autor.id}>
                                    {autor.nome}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p className="warning">⚠️ Não há autores cadastrados. Cadastre um autor primeiro para criar um livro.</p>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN (Opcional):</label>
                    <input
                        id="isbn"
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="anoPublicacao">Ano de Publicação (Opcional):</label>
                    <input
                        id="anoPublicacao"
                        type="number"
                        value={anoPublicacao}
                        onChange={(e) => setAnoPublicacao(e.target.value)}
                    />
                </div>

                <button type="submit" className="button-submit" disabled={!autores.length}>
                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
                <Link to="/livros" className="button-cancel">Cancelar</Link>
            </form>
        </div>
    );
}

export default BookForm;