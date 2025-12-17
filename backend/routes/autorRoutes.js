const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa o pool de conexão MySQL

// Função auxiliar para tratamento de erros
const handleError = (res, message, error, statusCode = 500) => {
    console.error(`Erro no servidor: ${message}`, error.message);
    res.status(statusCode).send({ message: `Erro no servidor: ${message}` });
};

// =======================================================
// Rota 1: GET /autores (Listar todos os autores)
// =======================================================
router.get('/', async (req, res) => {
    try {
        // Query SQL: Atualizada para 'authors' e nomes de colunas em inglês
        const query = 'SELECT id, name, nationality, created_at, updated_at FROM authors ORDER BY name';
        const [rows] = await db.query(query); 
        
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, 'Falha ao listar autores.', error);
    }
});


// =======================================================
// Rota 2: GET /autores/:id (Buscar autor por ID)
// =======================================================
router.get('/:id', async (req, res) => {
    const { id } = req.params; 
    try {
        // Query SQL: Atualizada para 'authors' e 'name'
        const query = 'SELECT id, name, nationality, created_at, updated_at FROM authors WHERE id = ?';
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Autor não encontrado.' });
        }
        
        res.status(200).json(rows[0]);
    } catch (error) {
        handleError(res, `Falha ao buscar o autor com ID ${id}.`, error);
    }
});


// =======================================================
// Rota 3: POST /autores (Criar novo autor)
// =======================================================
router.post('/', async (req, res) => {
    // Pegamos 'nome' e 'nacionalidade' do corpo (Frontend ainda envia assim) 
    // e mapeamos para 'name' e 'nationality' no SQL
    const { nome, nacionalidade } = req.body; 

    if (!nome) {
        return res.status(400).send({ message: 'Nome do autor é obrigatório.' });
    }

    try {
        // Query SQL: Atualizada para tabela 'authors' e colunas 'name', 'nationality'
        const query = 'INSERT INTO authors (name, nationality) VALUES (?, ?)';
        const [result] = await db.query(query, [nome, nacionalidade]);

        res.status(201).send({
            id: result.insertId,
            message: 'Autor criado com sucesso!'
        });
    } catch (error) {
        handleError(res, 'Falha ao criar o novo autor.', error);
    }
});


// =======================================================
// Rota 4: PUT /autores/:id (Atualizar autor)
// =======================================================
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, nacionalidade } = req.body;

    if (!nome) {
        return res.status(400).send({ message: 'Nome do autor é obrigatório para atualização.' });
    }

    try {
        // Query SQL: Atualizada para 'authors', 'name' e 'nationality'
        const query = 'UPDATE authors SET name = ?, nationality = ? WHERE id = ?';
        const [result] = await db.query(query, [nome, nacionalidade, id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Autor não encontrado para atualização.' });
        }

        res.status(200).send({ message: 'Autor atualizado com sucesso!' });
    } catch (error) {
        handleError(res, `Falha ao atualizar o autor com ID ${id}.`, error);
    }
});


// =======================================================
// Rota 5: DELETE /autores/:id (Deletar autor)
// =======================================================
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Query SQL: Atualizada para 'authors'
        const query = 'DELETE FROM authors WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Autor não encontrado para exclusão.' });
        }

        res.status(200).send({ message: 'Autor excluído com sucesso!' });
    } catch (error) {
        if (error.errno === 1451) {
            return res.status(409).send({ 
                message: 'Conflito: Não é possível excluir este autor, pois ele possui livros vinculados.' 
            });
        }
        handleError(res, `Falha ao excluir o autor com ID ${id}.`, error, 500);
    }
});

module.exports = router;