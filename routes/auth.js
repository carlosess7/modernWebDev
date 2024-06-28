const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const router = express.Router();

// Configuração da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abc123',
    database: 'mind_care'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Por favor, preencha todos os campos' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)';
    db.query(sql, [name, email, passwordHash], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, error: 'Email já cadastrado' });
            }
            return res.status(500).json({ success: false, error: 'Erro no servidor' });
        }
        return res.status(200).json({ success: true, message: 'Registro bem-sucedido' });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ errorCode: 'missingFields' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ errorCode: 'serverError' });

        if (results.length === 0) {
            return res.status(400).json({ errorCode: 'invalidEmail' });
        }

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password_hash)) {
            return res.status(400).json({ errorCode: 'invalidPassword' });
        }

        if (!req.session) {
            return res.status(500).json({ errorCode: 'sessionError' });
        }

        req.session.user = { name: user.name };
        return res.status(200).json({ success: true });
    });
});


router.get('/checkLoginStatus', (req, res) => {
    const isLoggedIn = !!req.session.user;
    const userName = isLoggedIn ? req.session.user.name : null;
    res.json({ isLoggedIn, userName });
});

// Endpoint de logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).send('Erro ao fazer logout');
        }
        res.clearCookie('connect.sid'); // Nome do cookie de sessão pode variar
        res.sendStatus(200);
    });
});

router.post('/registerPsychologist', (req, res) => {
    const { name, email, phone, crp, specialty } = req.body;

    if (!name || !email || !phone || !crp || !specialty) {
        return res.status(400).json({ success: false, error: 'Por favor, preencha todos os campos' });
    }

    // Verificar se já existe um psicólogo com o mesmo CRP, email ou telefone
    const checkSql = 'SELECT * FROM Psicologos WHERE crp = ? OR email = ? OR phone = ?';
    db.query(checkSql, [crp, email, phone], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, error:'Erro ao verificar psicólogo'});
        }
        if (results.length > 0) {
            return res.status(400).json({success: false, error: 'Psicólogo com o mesmo CRP, email ou telefone já existe, verifique seus dados!' });
        }

        // Inserir novo psicólogo
        const insertSql = 'INSERT INTO Psicologos (name, email, phone, crp, specialty) VALUES (?, ?, ?, ?, ?)';
        db.query(insertSql, [name, email, phone, crp, specialty], (error, results) => {
            if (error) {
                console.error('Erro ao registrar psicólogo:', error);
                return res.status(500).json({success: false, error: 'Erro ao registrar psicólogo'});
            }
            return res.status(201).json({success: true, message: 'Psicólogo registrado com sucesso!' });
        });
    });
});

router.get('/psychologists', (req, res) => {
    const sql = 'SELECT * FROM Psicologos';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Erro ao buscar psicólogos:', error);
            return res.status(500).send('Erro ao buscar psicólogos');
        }
        res.json(results);
    });
});


module.exports = router;
