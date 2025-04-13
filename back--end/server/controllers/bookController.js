const Book = require('../model/Book');

class BookController {
    static async searchBooks(req, res) {
        try {
            const { search, genre } = req.query;
            const books = await Book.findAll(search, genre);
            res.json(books);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getBookDetails(req, res) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            res.json(book);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async addBook(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            
            const bookId = await Book.create(req.body);
            res.status(201).json({ message: 'Book added successfully', bookId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = BookController;