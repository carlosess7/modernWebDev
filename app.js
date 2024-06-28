const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto'); // Importa o módulo crypto para geração de chave secreta
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Middleware para processar os dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('assets'));

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Gera uma chave secreta aleatória de 32 bytes (256 bits)
const secret = crypto.randomBytes(32).toString('hex');

// Configuração da sessão com a chave secreta gerada
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

// Usar rotas de autenticação
app.use('/auth', authRoutes);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
