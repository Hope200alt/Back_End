const mysql = require('mysql2/promise');

class Reservation {
    static async create({ user_id, book_id, pickup_date }) {
        const [result] = await global.pool.execute(
            'INSERT INTO reservations (user_id, book_id, pickup_date, status) VALUES (?, ?, ?, "pending")',
            [user_id, book_id, pickup_date]
        );
        return result.insertId;
    }

    static async findByUser(userId) {
        const [rows] = await global.pool.execute(
            `SELECT r.*, b.title, b.author 
             FROM reservations r
             JOIN books b ON r.book_id = b.id
             WHERE r.user_id = ?`,
            [userId]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        await global.pool.execute(
            'UPDATE reservations SET status = ? WHERE id = ?',
            [status, id]
        );
    }

    static async findById(id) {
        const [rows] = await global.pool.execute(
            'SELECT * FROM reservations WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = Reservation;