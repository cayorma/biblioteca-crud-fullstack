import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/autores';

function AuthorForm() {
    const [nome, setName] = useState('');
    const [nacionalidade, setNationality] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams(); // Pega o ID da URL se estivermos editando

    const isEditing = !!id; // Se 'id' existir, estamos editando

    useEffect(() => {
        if (isEditing) {
            fetchAuthor(id);
        } else {
            // Se for criação, não há dados para carregar
            setLoading(false); 
        }
    }, [id, isEditing]);

    // Carrega dados do autor para preencher o formulário na edição
    const fetchAuthor = async (authorId) => {
        try {
            const response = await axios.get(`${API_URL}/${authorId}`);
            setName(response.data.nome);
            setNationality(response.data.nacionalidade || '');
            setLoading(false);
        } catch (err) {
            alert('Erro ao carregar dados do autor para edição. Redirecionando...');
            navigate('/autores');
        }
    };

    // Função chamada ao clicar em Cadastrar/Atualizar
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Dados a serem enviados (usamos 'nome' e 'nacionalidade' em português)
        const authorData = { nome, nacionalidade: nacionalidade || null };

        try {
            if (isEditing) {
                // Atualização (PUT)
                await axios.put(`${API_URL}/${id}`, authorData);
                alert('Autor atualizado com sucesso!');
            } else {
                // Criação (POST)
                await axios.post(API_URL, authorData);
                alert('Autor criado com sucesso!');
            }
            navigate('/autores'); // Redireciona para a lista
        } catch (err) {
            console.error("Erro ao salvar:", err);
            // Exibe a validação do backend (ex: nome é obrigatório)
            alert(err.response?.data?.message || 'Erro ao salvar o autor. Tente novamente.'); 
        }
    };

    if (loading && isEditing) return <p>Carregando formulário...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? '✏️ Editar Autor' : '✨ Novo Autor'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome (Obrigatório):</label>
                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nacionalidade">Nacionalidade (Opcional):</label>
                    <input
                        id="nacionalidade"
                        type="text"
                        value={nacionalidade}
                        onChange={(e) => setNationality(e.target.value)}
                    />
                </div>
                <button type="submit" className="button-submit">
                    {isEditing ? 'Atualizar' : 'Cadastrar'}
                </button>
                {/* Botão que usa Link para voltar para a rota de lista */}
                <Link to="/autores" className="button-cancel">Cancelar</Link>
            </form>
        </div>
    );
}

export default AuthorForm;