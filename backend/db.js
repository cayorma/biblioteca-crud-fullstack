const mysql = require('mysql2/promise');
require('dotenv').config(); 

// Cria um pool de conexões (melhor que uma única conexão)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Testa a conexão (apenas para ver a mensagem no console)
pool.getConnection()
    .then(connection => {
        console.log("✅ Conexão com MySQL estabelecida com sucesso!");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Erro ao conectar ao MySQL:", err.message);
    });

// Exporta o pool para ser usado nas rotas
module.exports = pool;