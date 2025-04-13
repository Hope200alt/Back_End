const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        const [rows] = await global.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    }

    static async create(userData) {
        const { username, password, email } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await global.pool.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email]
        );
        return result.insertId;
    }
}

module.exports = User;