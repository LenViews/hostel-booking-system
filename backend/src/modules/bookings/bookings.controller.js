const bookingService =
  require('./bookings.service');

exports.createBooking = async (
  req,
  res
) => {
  try {
    const booking =
      await bookingService.createBooking({
        ...req.body,
        user_id: req.user.id,
      });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getMyBookings =
  async (req, res) => {
    try {
      const bookings =
        await bookingService.getMyBookings(
          req.user.id
        );

      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

exports.getAllBookings =
  async (req, res) => {
    try {
      const bookings =
        await bookingService.getAllBookings();

      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

exports.cancelBooking =
  async (req, res) => {
    try {
      const booking =
        await bookingService.cancelBooking({
          booking_id: req.params.id,
          user_id: req.user.id,
          role: req.user.role,
        });

      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

exports.updateBookingStatus =
  async (req, res) => {
    try {
      const booking =
        await bookingService.updateBookingStatus({
          booking_id: req.params.id,
          status: req.body.status,
        });

      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  };

exports.getBookingAnalytics =
  async (req, res) => {
    try {
      const analytics =
        await bookingService.getBookingAnalytics();

      res.status(200).json(analytics);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
