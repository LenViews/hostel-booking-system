// bookingRoutes.js
const express = require('express');
const { createBooking, cancelBooking, getMyBookings, getAllBootings } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { admin, student } = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/', protect, student, createBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.get('/my-bookings', protect, student, getMyBookings);
router.get('/all', protect, admin, getAllBootings);

module.exports = router;