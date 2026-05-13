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
