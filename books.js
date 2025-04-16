// server/routes/books.js
const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth'); // Ensure this middleware decodes req.user

// Other book routes
router.get('/', BookController.searchBooks);
router.get('/:id', BookController.getBookDetails);
router.post('/', authMiddleware, BookController.addBook);
router.delete('/:id', authenticate, BookController.deleteBook);

// New DELETE route to remove a book
router.delete('/:id', authMiddleware, BookController.deleteBook);

module.exports = router;