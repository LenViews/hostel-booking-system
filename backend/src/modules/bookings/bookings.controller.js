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
