const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, ReservationController.reserveBook);
router.get('/my', authMiddleware, ReservationController.getUserReservations);
router.put('/:id/status', authMiddleware, ReservationController.updateReservationStatus);

module.exports = router;