// Books.js
class Book {
    static async findAll(search = '', genre = '') {
        let query = `SELECT * FROM books WHERE (title ILIKE $1 OR author ILIKE $1)`;
        const params = [`%${search}%`];

        if (genre) {
            query += ` AND genre = $2`;
            params.push(genre);
        }
        const { rows } = await global.pool.query(query, params);
        return rows;
    }

    static async findById(id) {
        const { rows } = await global.pool.query('SELECT * FROM books WHERE id = $1', [id]);
        return rows[0];
    }

    static async updateAvailability(id, change) {
        await global.pool.query(
            'UPDATE books SET available_copies = available_copies + $1 WHERE id = $2',
            [change, id]
        );
    }
    static async delete(id) {
        await global.pool.query('DELETE FROM books WHERE id = $1', [id]);
      }

    static async create(bookData) {
        // Include image_url in the destructuring (optional if not provided)
        const { title, author, genre, isbn, published_year, total_copies, description, image_url } = bookData;
        const { rows } = await global.pool.query(
            `INSERT INTO books 
            (title, author, genre, isbn, published_year, total_copies, available_copies, description, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8) 
            RETURNING id`,
            [title, author, genre, isbn, published_year, total_copies, description, image_url]
        );
        return rows[0].id;
    }
}

module.exports = Book;