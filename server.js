require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        return;
    }
    console.log('Подключено к MySQL');
});

connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    telegramId VARCHAR(255) NOT NULL UNIQUE,
    firstName VARCHAR(255),
    photoUrl VARCHAR(255),
    coins DOUBLE DEFAULT 0
  )
`, (err) => {
    if (err) {
        console.error('Ошибка создания таблицы пользователей:', err);
    }
});

app.post('/api/users', (req, res) => {
    const { telegramId, firstName, photoUrl } = req.body;
    connection.query(
        'INSERT INTO users (telegramId, firstName, photoUrl) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE firstName = ?, photoUrl = ?',
        [telegramId, firstName, photoUrl, firstName, photoUrl],
        (err) => {
            if (err) {
                console.error('Ошибка добавления юзера:', err);
                return res.status(500).send('Server error');
            }
            res.send('Юзер добавлен/обновлён');
        }
    );
});

app.get('/api/users/:telegramId', (req, res) => {
    const { telegramId } = req.params;
    connection.query(
        'SELECT coins FROM users WHERE telegramId = ?',
        [telegramId],
        (err, results) => {
            if (err) {
                console.error('Ошибка получения монет:', err);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                return res.status(404).send({ message: 'Юзер не найден' });
            }
            res.json({ coins: results[0].coins });
        }
    );
});

app.put('/api/users/:telegramId/coins', (req, res) => {
    const { telegramId } = req.params;
    const { coins } = req.body;
    connection.query(
        'UPDATE users SET coins = ? WHERE telegramId = ?',
        [coins, telegramId],
        (err) => {
            if (err) {
                console.error('Ошибка получения монет:', err);
                return res.status(500).send('Server error');
            }
            res.send('Монеты обновлены');
        }
    );
});

app.get('/api/leaders', (req, res) => {
    connection.query(
        'SELECT firstName, coins FROM users ORDER BY coins DESC LIMIT 100',
        (err, results) => {
            if (err) {
                console.error('Ошибка получения лидеров:', err);
                return res.status(500).send('Server error');
            }
            if (results.length === 0) {
                return res.status(404).send({ message: 'Юзер не найден' });
            }
            res.json(results);
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
