const express = require('express');

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
  getBookingAnalytics,
} = require('./bookings.controller');

const {
  authenticate,
} = require('../../middlewares/auth.middleware');

const {
  authorize,
} = require('../../middlewares/role.middleware');

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

router.get(
  '/',
  authenticate,
  authorize('admin'),
  getAllBookings
);

router.patch(
  '/:id/cancel',
  authenticate,
  cancelBooking
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  updateBookingStatus
);

router.get(
  '/analytics/summary',
  authenticate,
  authorize('admin'),
  getBookingAnalytics
);

module.exports = router;
