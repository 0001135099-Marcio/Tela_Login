const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

// --- CONFIGURAÇÕES ---
app.use(express.json()); // Permite ler JSON no corpo das requisições
app.use(cors());         // Permite que o Frontend acesse o Backend

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'User-12910', // <-- Certifique-se de que esta é sua senha do MySQL
    database: 'sistema_login'
};

// --- TESTE DE CONEXÃO INICIAL ---
async function testarConexao() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("✅ Conectado ao MySQL com sucesso!");
        await connection.end();
    } catch (error) {
        console.error("❌ ERRO: Não foi possível conectar ao banco de dados.");
        console.error("Detalhes:", error.message);
        process.exit(1); // Para o servidor se o banco não estiver rodando
    }
}

testarConexao();

// --- ROTA DE CADASTRO ---
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validação de segurança extra no servidor
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. Verifica se o e-mail já existe
        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "Este e-mail já está em uso." });
        }

        // 2. Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insere no banco
        await connection.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "Usuário criado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno ao cadastrar usuário." });
    } finally {
        if (connection) await connection.end();
    }
});

// --- ROTA DE LOGIN ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios!" });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. Busca o usuário
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuário não encontrado." });
        }

        const user = rows[0];

        // 2. Compara a senha digitada com o hash do banco
        const senhaCorreta = await bcrypt.compare(password, user.password);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        // 3. Retorna sucesso e dados básicos
        res.json({
            message: "Login realizado!",
            user: { id: user.id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno ao processar login." });
    } finally {
        if (connection) await connection.end();
    }
});

// --- INICIALIZAÇÃO ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});