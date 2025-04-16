// server/controllers/bookController.js
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
      // Ensure only admin is allowed to add books
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const {
        title,
        author,
        genre,
        isbn,
        published_year,
        total_copies,
        description,
        image_url  // this should be a URL string pointing to an image online
      } = req.body;
      const bookId = await Book.create({
        title,
        author,
        genre,
        isbn,
        published_year,
        total_copies,
        description,
        image_url
      });
      res.status(201).json({ message: 'Book added successfully', bookId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  // New method to delete a book
  static async deleteBook(req, res) {
    try {
      // Only admin is allowed to delete books.
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      const { id } = req.params;
      await Book.delete(id);
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
module.exports = BookController;