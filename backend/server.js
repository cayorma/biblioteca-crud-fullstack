const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3001;

// Garante que a conexão com o DB seja executada
require('./db'); 

// 1. Middlewares Essenciais
// Permite que o Frontend acesse a API
app.use(cors({
    origin: 'http://localhost:5173' // A porta que o React/Vite usará
}));
// Permite que o Express leia dados JSON enviados pelo Frontend
app.use(express.json()); 

// 2. Importa Rotas
const autorRoutes = require('./routes/autorRoutes');
const livroRoutes = require('./routes/livroRoutes');

// 3. Define as Rotas Base da API
// Qualquer requisição para /autores será direcionada para autorRoutes.js
app.use('/autores', autorRoutes); 
// Qualquer requisição para /livros será direcionada para livroRoutes.js
app.use('/livros', livroRoutes);   

// Rota de teste
app.get('/', (req, res) => {
    res.status(200).send({ message: 'API da Biblioteca Acadêmica rodando!' });
});

// 4. Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express rodando na porta ${PORT}`);
});