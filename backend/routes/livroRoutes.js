const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa o pool de conexão MySQL

// Função auxiliar para tratamento de erros
const handleError = (res, message, error, statusCode = 500) => {
    console.error(`Erro no servidor: ${message}`, error.message);
    res.status(statusCode).send({ message: `Erro no servidor: ${message}` });
};

// =======================================================
// Rota 1: GET /livros (Listar todos os livros com nome do autor)
// =======================================================
router.get('/', async (req, res) => {
    try {
        // Query SQL: Incluído as colunas de auditoria conforme seu script do Workbench
        const query = `
            SELECT b.id, b.title, b.year, b.category, b.author_id, b.created_at, b.updated_at, a.name AS autor_nome 
            FROM books b
            JOIN authors a ON b.author_id = a.id
            ORDER BY b.title`;
        
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, 'Falha ao listar livros.', error);
    }
});

// =======================================================
// Rota 2: GET /livros/:id (Buscar livro por ID)
// =======================================================
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT id, title, year, category, author_id, created_at, updated_at FROM books WHERE id = ?';
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Livro não encontrado.' });
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        handleError(res, `Falha ao buscar o livro com ID ${id}.`, error);
    }
});

// =======================================================
// Rota 3: POST /livros (Criar novo livro)
// =======================================================
router.post('/', async (req, res) => {
    // Pegando os dados vindos do Frontend (mantendo nomes em português para compatibilidade com o React)
    const { titulo, ano, categoria, autor_id } = req.body;

    if (!titulo || !autor_id) {
        return res.status(400).send({ message: 'Título e ID do autor são obrigatórios.' });
    }

    try {
        // Query SQL: Colunas em inglês conforme o novo script do Workbench
        const query = 'INSERT INTO books (title, year, category, author_id) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(query, [titulo, ano, categoria, autor_id]);

        res.status(201).send({
            id: result.insertId,
            message: 'Livro criado com sucesso!'
        });
    } catch (error) {
        handleError(res, 'Falha ao criar o novo livro.', error);
    }
});

// =======================================================
// Rota 4: PUT /livros/:id (Atualizar livro)
// =======================================================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, ano, categoria, autor_id } = req.body;

    if (!titulo || !autor_id) {
        return res.status(400).send({ message: 'Dados insuficientes para atualização (Título e Autor são obrigatórios).' });
    }

    try {
        const query = 'UPDATE books SET title = ?, year = ?, category = ?, author_id = ? WHERE id = ?';
        const [result] = await db.query(query, [titulo, ano, categoria, autor_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Livro não encontrado para atualização.' });
        }

        res.status(200).send({ message: 'Livro atualizado com sucesso!' });
    } catch (error) {
        handleError(res, `Falha ao atualizar o livro com ID ${id}.`, error);
    }
});

// =======================================================
// Rota 5: DELETE /livros/:id (Deletar livro)
// =======================================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM books WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Livro não encontrado para exclusão.' });
        }

        res.status(200).send({ message: 'Livro excluído com sucesso!' });
    } catch (error) {
        handleError(res, `Falha ao excluir o livro com ID ${id}.`, error);
    }
});

module.exports = router;