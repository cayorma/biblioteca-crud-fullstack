# 📚 API da Biblioteca Acadêmica (CRUD Full-Stack)

O projeto implementa um sistema de gerenciamento de biblioteca, reunindo o back-end (Express.js + MySQL) e o front-end (React/Vite). O objetivo é demonstrar a implementação do CRUD completo para as entidades **Autores** e **Livros**.

---

## 🚧 Status do Projeto

✅ **COMPLETO:** Funcionalidades de CRUD (Criar, Ler, Atualizar, Excluir) para Autores e Livros implementadas e testadas.

---

## 🗂 Estrutura do Repositório

O projeto está organizado para separar as responsabilidades do servidor e do cliente:

###biblioteca-crud/ ├── backend/ → API em Express.js (Porta 3001) └── frontend/ → Aplicação em React/Vite (Porta 5173)
---

## 🛠 Tecnologias Utilizadas

| Camada | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Back-end** | Node.js / **Express.js** | API RESTful e lógica de Controllers. |
| **Front-end** | **React** (via Vite) | Interface do Usuário e consumo da API. |
| **Banco de Dados** | **MySQL** | Banco de dados relacional. |
| **Ferramentas** | `CORS`, `dotenv`, `MySQL2` | Gerenciamento de portas e conexão. |

---

## 💾 1. Configuração do Banco de Dados (MySQL)

Este projeto requer que o serviço do MySQL esteja ativo no seu sistema.O script SQL pode ser executado tanto no MySQL Command Line Client quanto no MySQL Workbench. Se utilizar o Workbench, basta copiar o script para uma nova Query Tab e clicar no ícone do raio para executar.
Criação das tabelas: 
Conecte-se ao seu cliente MySQL (ex: MySQL 8.0 Command Line Client) e execute os seguintes comandos SQL para criar as tabelas e a Chave Estrangeira com todas as colunas existentes:

MYSQLWORKBENCH
-- Criar banco
CREATE DATABASE IF NOT EXISTS biblioteca_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE biblioteca_db;
-- Tabela de Autores (OBRIGATÓRIA)
CREATE TABLE authors (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
nationality VARCHAR(100),
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Tabela de Livros (OBRIGATÓRIA)
CREATE TABLE books (
id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(255) NOT NULL,
year INT,
category VARCHAR(100),
author_id INT NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_books_author
FOREIGN KEY (author_id)
REFERENCES authors(id)
ON DELETE RESTRICT
ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMAND LINE
-- 1. Tabela Autores (Inclui campos de timestamp para auditoria)
CREATE TABLE autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    nacionalidade VARCHAR(100),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabela Livros (Com Chave Estrangeira)
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao INT,
    ano INT, -- Coluna duplicada 'ano' existe no schema atual
    categoria VARCHAR(100),
    autor_id INT NOT NULL,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);

Detalhamento das Estruturas
Para referência, as tabelas possuem as seguintes colunas, conforme o comando DESCRIBE:
###Tabela autores
Coluna,Tipo de Dado,Restrições
id,INT,Chave Primária
nome,VARCHAR(255),Obrigatório (NOT NULL)
nacionalidade,VARCHAR(100),Opcional
criado_em,TIMESTAMP,Auditoria (Automático)
atualizado_em,TIMESTAMP,Auditoria (Atualizado Automaticamente)

###Tabela livros
Coluna,Tipo de Dado,Restrições
id,INT,Chave Primária
titulo,VARCHAR(255),Obrigatório (NOT NULL)
isbn,VARCHAR(20),Único (UNIQUE)
ano_publicacao,INT,Opcional
ano,INT,"Duplicado, mas existente no schema"
categoria,VARCHAR(100),Opcional
autor_id,INT,Chave Estrangeira e Obrigatório (NOT NULL)

### 1.1. Configuração de Variáveis de Ambiente

Na pasta **`backend/`**, crie ou verifique se o arquivo **`.env`** existe e está configurado com suas credenciais:

```.env
MYSQL 8.0 Command Line Client
DB_HOST=localhost
DB_USER=root@localhost 
DB_PASSWORD=Scfcamor@123
DB_DATABASE=biblioteca_db
PORT=3001

###Como executar o projeto :É necessário rodar o Backend e o Frontend em terminais separados para que a aplicação Full-Stack funcione.
Acesse a pasta:cd backend
Instale as dependências(primeira vez):npm install
Inicie o servidor:node server.js
###O Backend será iniciado em: http://localhost:3001.
Iniciar o Frontend: Abra um NOVO terminal e acesse a pasta:cd frontend
Instale as dependências (Primeira vez):npm install
Inicie a aplicação:npm run dev
###O Frontend será iniciado em: http://localhost:5173.
###Após iniciar ambos os servidores, acesse o link no seu navegador:http://localhost:5173/