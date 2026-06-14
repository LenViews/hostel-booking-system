const pool = require('../../config/db');

exports.createBooking = async ({
  user_id,
  room_id,
  check_in_date,
  check_out_date,
}) => {
  if (
    !room_id ||
    !check_in_date ||
    !check_out_date
  ) {
    throw new Error(
      'Missing required fields'
    );
  }

  /*
    OVERLAP CHECK

    requested_start < existing_end
    AND
    requested_end > existing_start
  */

  const [overlappingBookings] =
    await pool.query(
      `SELECT *
       FROM bookings
       WHERE room_id = ?
       AND status = 'confirmed'
       AND (
          check_in_date < ?
          AND check_out_date > ?
       )`,
      [
        room_id,
        check_out_date,
        check_in_date,
      ]
    );

  if (
    overlappingBookings.length > 0
  ) {
    throw new Error(
      'Room already booked for selected dates'
    );
  }

  const [result] = await pool.query(
    `INSERT INTO bookings
    (
      user_id,
      room_id,
      check_in_date,
      check_out_date
    )
    VALUES (?, ?, ?, ?)`,
    [
      user_id,
      room_id,
      check_in_date,
      check_out_date,
    ]
  );

  const [bookings] =
    await pool.query(
      `SELECT *
       FROM bookings
       WHERE id = ?`,
      [result.insertId]
    );

  return bookings[0];
};

exports.getMyBookings =
  async (user_id) => {
    const [bookings] =
      await pool.query(
        `SELECT
          bookings.*,

          rooms.room_number,

          hostels.name
          AS hostel_name

        FROM bookings

        JOIN rooms
        ON bookings.room_id = rooms.id

        JOIN hostels
        ON rooms.hostel_id = hostels.id

        WHERE bookings.user_id = ?

        ORDER BY bookings.created_at DESC`,
        [user_id]
      );

    return bookings;
  };

exports.getAllBookings =
  async () => {
    const [bookings] =
      await pool.query(
        `SELECT
          bookings.*,

          users.name
          AS student_name,

          rooms.room_number,

          hostels.name
          AS hostel_name

        FROM bookings

        JOIN users
        ON bookings.user_id = users.id

        JOIN rooms
        ON bookings.room_id = rooms.id

        JOIN hostels
        ON rooms.hostel_id = hostels.id

        ORDER BY bookings.created_at DESC`
      );

    return bookings;
  };

exports.cancelBooking =
  async ({
    booking_id,
    user_id,
    role,
  }) => {
    const [bookings] =
      await pool.query(
        `SELECT *
        FROM bookings
        WHERE id = ?`,
        [booking_id]
      );

    const booking = bookings[0];

    if (!booking) {
      throw new Error(
        'Booking not found'
      );
    }

    /*
      Students can only cancel
      their own bookings.

      Admins can cancel any.
    */

    if (
      role !== 'admin' &&
      booking.user_id !== user_id
    ) {
      throw new Error(
        'Unauthorized action'
      );
    }

    await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = ?`,
      [booking_id]
    );

    const [updatedBookings] =
      await pool.query(
        `SELECT *
         FROM bookings
         WHERE id = ?`,
        [booking_id]
      );

    return updatedBookings[0];
  };

exports.updateBookingStatus =
  async ({
    booking_id,
    status,
  }) => {
    const allowedStatuses = [
      'pending',
      'confirmed',
      'cancelled',
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      throw new Error(
        'Invalid booking status'
      );
    }

    await pool.query(
      `UPDATE bookings
       SET status = ?
       WHERE id = ?`,
      [
        status,
        booking_id,
      ]
    );

    const [bookings] =
      await pool.query(
        `SELECT *
         FROM bookings
         WHERE id = ?`,
        [booking_id]
      );

    return bookings[0];
  };

exports.getBookingAnalytics =
  async () => {
    const [totalBookings] =
      await pool.query(
        `SELECT COUNT(*) AS total
         FROM bookings`
      );

    const [confirmedBookings] =
      await pool.query(
        `SELECT COUNT(*) AS total
         FROM bookings
         WHERE status = 'confirmed'`
      );

    const [cancelledBookings] =
      await pool.query(
        `SELECT COUNT(*) AS total
         FROM bookings
         WHERE status = 'cancelled'`
      );

    const [availableRooms] =
      await pool.query(
        `SELECT COUNT(*) AS total
         FROM rooms
         WHERE status = 'available'`
      );

    return {
      total_bookings:
        totalBookings[0].total,

      confirmed_bookings:
        confirmedBookings[0].total,

      cancelled_bookings:
        cancelledBookings[0].total,

      available_rooms:
        availableRooms[0].total,
    };
  };
