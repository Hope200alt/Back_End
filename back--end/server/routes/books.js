const express = require('express');
const router = express.Router();
const BookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

router.get('/', BookController.searchBooks);
router.get('/:id', BookController.getBookDetails);
router.post('/', authMiddleware, BookController.addBook);

module.exports = router;