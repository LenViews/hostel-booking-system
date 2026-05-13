const express = require('express');

const {
  createBooking,
  getMyBookings,
} = require('./bookings.controller');

const {
  authenticate,
} = require('../../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/',
  authenticate,
  createBooking
);

router.get(
  '/my-bookings',
  authenticate,
  getMyBookings
);

module.exports = router;
