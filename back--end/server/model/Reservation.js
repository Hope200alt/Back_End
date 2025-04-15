class Reservation {
    static async create({ user_id, book_id, pickup_date }) {
        const { rows } = await global.pool.query(
            'INSERT INTO reservations (user_id, book_id, pickup_date, status) VALUES ($1, $2, $3, $4) RETURNING id',
            [user_id, book_id, pickup_date, 'pending']
        );
        return rows[0].id;
    }

    static async findByUser(userId) {
        const { rows } = await global.pool.query(
            `SELECT r.*, b.title, b.author 
             FROM reservations r
             JOIN books b ON r.book_id = b.id
             WHERE r.user_id = $1`,
            [userId]
        );
        return rows;
    }

    static async updateStatus(id, status) {
        await global.pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2',
            [status, id]
        );
    }

    static async findById(id) {
        const { rows } = await global.pool.query(
            'SELECT * FROM reservations WHERE id = $1',
            [id]
        );
        return rows[0];
    }
}

module.exports = Reservation;