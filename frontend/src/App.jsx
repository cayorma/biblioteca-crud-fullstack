// frontend/src/App.jsx
import { Outlet, Link } from 'react-router-dom';
import './App.css'; // Estilos específicos do App

function App() {
  return (
    <div className="container">
      <header>
        <h1>📚 Biblioteca Acadêmica</h1>
        <nav>
          {/* O Link é usado para navegar entre as rotas do React */}
          <Link to="/autores">Autores</Link> 
          <span className="separator"> | </span>
          <Link to="/livros">Livros</Link>
        </nav>
      </header>
      <main>
        {/* O Outlet é onde o conteúdo da rota ativa (AuthorList, BookList, etc.) é renderizado */}
        <Outlet /> 
      </main>
      <footer>
        <p>&copy; Projeto CRUD - Desenvolvimento Web II</p>
      </footer>
    </div>
  );
}

export default App;