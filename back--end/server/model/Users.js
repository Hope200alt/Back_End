const bcrypt = require('bcrypt');

class User {
    static async findByUsername(username) {
        const { rows } = await global.pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return rows[0];
    }

    static async create(userData) {
        const { username, password, email } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await global.pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id',
            [username, hashedPassword, email]
        );
        return rows[0].id;
    }
}

module.exports = User;