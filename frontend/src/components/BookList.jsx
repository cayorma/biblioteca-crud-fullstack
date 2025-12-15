// frontend/src/components/BookList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/livros';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            // Chama a nova rota do Backend para Livros
            const response = await axios.get(API_URL);
            setBooks(response.data); 
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error("Erro ao buscar livros:", err);
            setError('Falha ao carregar a lista de livros. Verifique o Backend (porta 3001) e a tabela de livros.');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este livro?")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`);
            alert('Livro excluído com sucesso!');
            fetchBooks(); // Recarrega a lista
        } catch (err) {
            console.error("Erro na exclusão:", err);
            alert(err.response?.data?.message || 'Erro ao excluir o livro. Pode haver dependências.'); 
        }
    };

    if (loading) return <p>Carregando livros...</p>;
    if (error) return <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>;

    return (
        <div className="list-container">
            <h2>📚 Listagem de Livros</h2>
            <Link to="/livros/novo" className="button-primary">Novo Livro</Link>

            {books.length === 0 ? (
                <p>Nenhum livro cadastrado. Clique em "Novo Livro" para começar.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>ISBN</th>
                            <th>Ano</th>
                            <th>Autor</th> 
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id}>
                                <td>{book.id}</td>
                                <td>{book.titulo}</td>
                                <td>{book.isbn || 'N/A'}</td>
                                <td>{book.ano_publicacao || 'N/A'}</td>
                                <td>{book.autor_nome || 'Autor Desconhecido'}</td> {/* Mostra o nome do autor */}
                                <td>
                                    <Link to={`/livros/${book.id}/editar`} className="button-edit">Editar</Link>
                                    <button onClick={() => handleDelete(book.id)} className="button-delete">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BookList;