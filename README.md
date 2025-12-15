🚧 Status do Projeto
✅ COMPLETO: Funcionalidades de CRUD (Criar, Ler, Atualizar, Excluir) para Autores e Livros implementadas e testadas.

🗂 Estrutura do Repositório
O projeto está organizado para separar as responsabilidades do servidor e do cliente:
biblioteca-crud/
├── backend/     → API em Express.js (Porta 3001)
└── frontend/    → Aplicação em React/Vite (Porta 5173)

🛠 Tecnologias Utilizadas
Camada	Tecnologia	Detalhes
Back-end	Node.js / Express.js	API RESTful e lógica de Controllers
Front-end	React (via Vite)	Interface do Usuário e consumo da API
Banco de Dados	MySQL	Banco de dados relacional
Bibliotecas	CORS, dotenv, MySQL2	Gerenciamento de portas e conexão

💾 Configuração do Banco de Dados (MySQL)
Este projeto requer que o serviço do MySQL esteja ativo no seu sistema.
1.1. Configuração de Variáveis de Ambiente
Na pasta backend/, crie ou verifique se o arquivo .env existe e está configurado com suas credenciais:
DB_HOST=localhost
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha
DB_DATABASE=biblioteca_db
PORT=3001
1.2. Criação do Banco de Dados e Tabelas
Conecte-se ao seu cliente MySQL (ex: MySQL 8.0 Command Line Client) e execute os seguintes comandos SQL:
-- Criar o banco de dados
CREATE DATABASE IF NOT EXISTS biblioteca_db;
USE biblioteca_db;

-- Tabela de Autores
CREATE TABLE IF NOT EXISTS autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nacionalidade VARCHAR(50),
    data_nascimento DATE
);

-- Tabela de Livros
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao INT,
    autor_id INT,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE SET NULL
);

🚀 Como Executar o Projeto
É necessário rodar o Backend e o Frontend em terminais separados para que a aplicação Full-Stack funcione.
Backend (API)
Acesse a pasta:
cd backend
Instale as dependências (primeira vez):
npm install
Inicie o servidor:
node server.js
O Backend será iniciado em: http://localhost:3001

Frontend (Aplicação React)
Abra um NOVO terminal e acesse a pasta:
cd frontend
Instale as dependências (primeira vez):
npm install
Inicie a aplicação:
npm run dev
O Frontend será iniciado em: http://localhost:5173

🌐 Acesso à Aplicação
Após iniciar ambos os servidores, acesse no seu navegador:
Frontend: http://localhost:5173
Backend (API): http://localhost:3001

📡 Endpoints da API
Autores
GET /autores - Lista todos os autores
GET /autores/:id - Busca um autor específico
POST /autores - Cria um novo autor
PUT /autores/:id - Atualiza um autor existente
DELETE /autores/:id - Remove um autor

Livros
GET /livros - Lista todos os livros (com dados do autor)
GET /livros/:id - Busca um livro específico
POST /livros - Cria um novo livro
PUT /livros/:id - Atualiza um livro existente
DELETE /livros/:id - Remove um livro

📝 Observações
Certifique-se de que o MySQL está rodando antes de iniciar o backend
Configure corretamente as credenciais do banco no arquivo .env
A ordem de inicialização é: MySQL → Backend → Frontend
Para desenvolvimento, o Vite utiliza hot-reload no frontend

