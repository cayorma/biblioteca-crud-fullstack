// backend/LivroController.js
const db = require('./db'); 

// 1. READ (Buscar todos os livros, incluindo o nome do autor)
exports.getAll = async (req, res) => {
    const sql = `
        SELECT 
            l.id, 
            l.titulo, 
            l.isbn, 
            l.ano_publicacao, 
            l.autor_id, 
            a.nome as autor_nome
        FROM 
            livros l
        JOIN 
            autores a ON l.autor_id = a.id
        ORDER BY l.titulo
    `;
    try {
        const [livros] = await db.query(sql);
        res.json(livros);
    } catch (err) {
        console.error("Erro ao buscar livros:", err);
        res.status(500).json({ message: "Erro ao buscar a lista de livros." });
    }
};

// 2. READ (Buscar um livro por ID)
exports.getById = async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM livros WHERE id = ?';
    try {
        const [livros] = await db.query(sql, [id]);
        if (livros.length === 0) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }
        res.json(livros[0]);
    } catch (err) {
        console.error("Erro ao buscar livro por ID:", err);
        res.status(500).json({ message: "Erro ao buscar livro." });
    }
};

// 3. CREATE (Criar um novo livro)
exports.create = async (req, res) => {
    const { titulo, isbn, ano_publicacao, autor_id } = req.body;

    // Validação básica
    if (!titulo || !autor_id) {
        return res.status(400).json({ message: "O título e o ID do autor são obrigatórios." });
    }

    const sql = 'INSERT INTO livros (titulo, isbn, ano_publicacao, autor_id) VALUES (?, ?, ?, ?)';
    try {
        const result = await db.query(sql, [titulo, isbn || null, ano_publicacao || null, autor_id]);
        res.status(201).json({ id: result.insertId, message: "Livro criado com sucesso!" });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: "O ID do autor fornecido não existe." });
        }
        console.error("Erro ao criar livro:", err);
        res.status(500).json({ message: "Erro interno ao criar livro." });
    }
};

// 4. UPDATE (Atualizar um livro)
exports.update = async (req, res) => {
    const { id } = req.params;
    const { titulo, isbn, ano_publicacao, autor_id } = req.body;

    if (!titulo || !autor_id) {
        return res.status(400).json({ message: "O título e o ID do autor são obrigatórios." });
    }

    const sql = 'UPDATE livros SET titulo = ?, isbn = ?, ano_publicacao = ?, autor_id = ? WHERE id = ?';
    try {
        await db.query(sql, [titulo, isbn || null, ano_publicacao || null, autor_id, id]);
        res.json({ message: "Livro atualizado com sucesso!" });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ message: "O ID do autor fornecido não existe." });
        }
        console.error("Erro ao atualizar livro:", err);
        res.status(500).json({ message: "Erro interno ao atualizar livro." });
    }
};

// 5. DELETE (Excluir um livro)
exports.remove = async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM livros WHERE id = ?';
    try {
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Livro não encontrado." });
        }
        res.json({ message: "Livro excluído com sucesso!" });
    } catch (err) {
        console.error("Erro ao excluir livro:", err);
        res.status(500).json({ message: "Erro ao excluir livro." });
    }
};