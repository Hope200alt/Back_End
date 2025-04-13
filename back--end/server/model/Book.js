class Book {
    static async findAll(search = '', genre = '') {
        const query = `
            SELECT * FROM books 
            WHERE title LIKE ? OR author LIKE ?
            ${genre ? 'AND genre = ?' : ''}
        `;
        const params = [`%${search}%`, `%${search}%`];
        if (genre) params.push(genre);
        
        const [rows] = await global.pool.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await global.pool.execute('SELECT * FROM books WHERE id = ?', [id]);
        return rows[0];
    }

    static async updateAvailability(id, change) {
        await global.pool.execute(
            'UPDATE books SET available_copies = available_copies + ? WHERE id = ?',
            [change, id]
        );
    }

    static async create(bookData) {
        const { title, author, genre, isbn, published_year, total_copies, description } = bookData;
        const [result] = await global.pool.execute(
            'INSERT INTO books (title, author, genre, isbn, published_year, total_copies, available_copies, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, author, genre, isbn, published_year, total_copies, total_copies, description]
        );
        return result.insertId;
    }
}

module.exports = Book;