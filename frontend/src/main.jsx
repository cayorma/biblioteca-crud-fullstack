// frontend/src/main.jsx (CÓDIGO CORRETO E FINAL DO ROUTER)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import App from './App.jsx';
import './index.css'; 

// 2. Importa todos os componentes de visualização
// Usamos o caminho relativo padrão que agora funciona
import AuthorList from './components/AuthorList.jsx'; 
import AuthorForm from './components/AuthorForm.jsx'; 
import BookList from './components/BookList.jsx';     
import BookForm from './components/BookForm.jsx';     

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ROTA PRINCIPAL: Define o layout (Cabeçalho, Menu, Rodapé) 
          O conteúdo das rotas filhas será injetado no <Outlet /> dentro do App.
        */}
        <Route path="/" element={<App />}>
          
          {/* Rota Raiz (/) - Carrega a Listagem de Autores como página inicial */}
          <Route index element={<AuthorList />} /> 

          {/* Rota Explícita para /autores (também carrega a listagem) */}
          <Route path="autores" element={<AuthorList />} />
          
          {/* Rotas de Autores (para o CRUD) */}
          <Route path="autores/novo" element={<AuthorForm />} />
          <Route path="autores/:id/editar" element={<AuthorForm />} /> 

          {/* Rotas de Livros */}
          <Route path="livros" element={<BookList />} />
          <Route path="livros/novo" element={<BookForm />} />
          <Route path="livros/:id/editar" element={<BookForm />} /> 

          {/* Opcional: Rota de 404 (Qualquer caminho não encontrado) */}
          {/* <Route path="*" element={<h1>404: Página Não Encontrada</h1>} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);