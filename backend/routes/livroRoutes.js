// backend/routes/livroRoutes.js

const express = require('express');
const router = express.Router();

// Importa o Controller que contém a lógica de banco de dados
const livroController = require('../LivroController'); 

// Rotas CRUD para Livros
router.get('/', livroController.getAll);         // GET /livros (Buscar todos)
router.get('/:id', livroController.getById);     // GET /livros/:id (Buscar por ID)
router.post('/', livroController.create);        // POST /livros (Criar novo)
router.put('/:id', livroController.update);      // PUT /livros/:id (Atualizar)
router.delete('/:id', livroController.remove);   // DELETE /livros/:id (Excluir)

module.exports = router;