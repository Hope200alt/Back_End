const Reservation = require('../model/Reservation');
const Book = require('../model/Book');

class ReservationController {
    static async reserveBook(req, res) {
        try {
            const { book_id, pickup_date } = req.body;
            const user_id = req.user.id;

            const book = await Book.findById(book_id);
            if (!book || book.available_copies <= 0) {
                return res.status(400).json({ message: 'Book not available for reservation' });
            }

            const reservationId = await Reservation.create({ user_id, book_id, pickup_date });

            await Book.updateAvailability(book_id, -1);

            res.status(201).json({ message: 'Reservation created successfully', reservationId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async getUserReservations(req, res) {
        try {
            const reservations = await Reservation.findByUser(req.user.id);
            res.json(reservations);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async updateReservationStatus(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Unauthorized' });
            }
            const { status } = req.body;
            const reservationId = req.params.id;

            const reservation = await Reservation.findById(reservationId);
            if (!reservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }

            if (reservation.status !== 'pending' && (status === 'approved' || status === 'rejected')) {
                await Book.updateAvailability(reservation.book_id, 1);
            }

            await Reservation.updateStatus(reservationId, status);

            res.json({ message: 'Reservation status updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = ReservationController;