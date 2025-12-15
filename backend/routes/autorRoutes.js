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
        // Query SQL: Seleciona todos os autores ordenados pelo nome
        const query = 'SELECT id, nome, nacionalidade, criado_em, atualizado_em FROM autores ORDER BY nome';
        const [rows] = await db.query(query); // Executa a consulta e pega as linhas de resultado
        
        // Retorna a lista de autores (JSON)
        res.status(200).json(rows);
    } catch (error) {
        handleError(res, 'Falha ao listar autores.', error);
    }
});


// =======================================================
// Rota 2: GET /autores/:id (Buscar autor por ID)
// =======================================================
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Pega o ID da URL (ex: /autores/5)
    try {
        // Query SQL: Seleciona apenas o autor com o ID fornecido
        const query = 'SELECT id, nome, nacionalidade, criado_em, atualizado_em FROM autores WHERE id = ?';
        const [rows] = await db.query(query, [id]);

        if (rows.length === 0) {
            // Se não encontrou, retorna 404 (Not Found)
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
    const { nome, nacionalidade } = req.body; // Pega os dados JSON do corpo da requisição

    // Validação de dados (O nome é obrigatório)
    if (!nome) {
        return res.status(400).send({ message: 'Nome do autor é obrigatório.' });
    }

    try {
        // Query SQL: Insere um novo autor. O '?' protege contra injeção SQL.
        const query = 'INSERT INTO autores (nome, nacionalidade) VALUES (?, ?)';
        const [result] = await db.query(query, [nome, nacionalidade]);

        // Retorna o ID gerado e uma mensagem de sucesso (status 201: Created)
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
        // Query SQL: Atualiza o autor com o ID fornecido
        const query = 'UPDATE autores SET nome = ?, nacionalidade = ? WHERE id = ?';
        const [result] = await db.query(query, [nome, nacionalidade, id]);

        if (result.affectedRows === 0) {
            // Se 0 linhas foram afetadas, o autor não existia
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
        const query = 'DELETE FROM autores WHERE id = ?';
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Autor não encontrado para exclusão.' });
        }

        res.status(200).send({ message: 'Autor excluído com sucesso!' });
    } catch (error) {
        // Tratamento de erro específico para a Chave Estrangeira (Foreign Key)
        // O MySQL retorna o código 1451 se o autor tiver livros vinculados
        if (error.errno === 1451) {
            return res.status(409).send({ 
                message: 'Conflito: Não é possível excluir este autor, pois ele possui livros vinculados. Remova os livros primeiro.' 
            });
        }
        handleError(res, `Falha ao excluir o autor com ID ${id}.`, error, 500);
    }
});

module.exports = router;