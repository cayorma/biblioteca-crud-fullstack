import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// URL base da sua API (porta 3001)
const API_URL = 'http://localhost:3001/autores';

function AuthorList() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect roda o código apenas uma vez, ao carregar o componente
    useEffect(() => {
        fetchAuthors();
    }, []);

    // Função assíncrona para buscar os autores na API
    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            // Salva os dados no estado do componente
            setAuthors(response.data); 
            setLoading(false);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar a lista de autores. Verifique se o Backend está rodando (porta 3001) e se o nome da API está correto.');
            setLoading(false);
        }
    };

    // Função para excluir um autor (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir este autor?")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`);
            alert('Autor excluído com sucesso!');
            fetchAuthors(); // Recarrega a lista para remover o item
        } catch (err) {
            console.error("Erro na exclusão:", err);
            // Exibe a mensagem de erro do backend (ex: erro de chave estrangeira)
            alert(err.response?.data?.message || 'Erro ao excluir o autor.'); 
        }
    };

    if (loading) return <p>Carregando autores...</p>;
    // Exibe o erro de forma clara
    if (error) return <p style={{color: 'red', fontWeight: 'bold'}}>{error}</p>;

    return (
        <div className="list-container">
            <h2>📝 Listagem de Autores</h2>
            {/* Botão que leva ao formulário de novo autor */}
            <Link to="/autores/novo" className="button-primary">Novo Autor</Link>
            
            {authors.length === 0 ? (
                <p>Nenhum autor cadastrado. Clique em "Novo Autor" para começar.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nacionalidade</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {authors.map((author) => (
                            <tr key={author.id}>
                                <td>{author.id}</td>
                                <td>{author.nome}</td> {/* Usa 'nome' e 'nacionalidade' conforme o Backend */}
                                <td>{author.nacionalidade || 'Não informada'}</td>
                                <td>
                                    {/* Link que leva ao formulário de edição, passando o ID */}
                                    <Link to={`/autores/${author.id}/editar`} className="button-edit">Editar</Link>
                                    <button onClick={() => handleDelete(author.id)} className="button-delete">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AuthorList;