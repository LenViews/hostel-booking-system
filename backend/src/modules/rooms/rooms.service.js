const pool = require('../../config/db');

exports.createRoom = async ({
  hostel_id,
  room_number,
  capacity,
  price,
  image_url,
}) => {
  if (
    !hostel_id ||
    !room_number ||
    !capacity
  ) {
    throw new Error(
      'Missing required fields'
    );
  }

  const [result] = await pool.query(
    `INSERT INTO rooms
    (
      hostel_id,
      room_number,
      capacity,
      price,
      image_url
    )
    VALUES (?, ?, ?, ?, ?)`,
    [
      hostel_id,
      room_number,
      capacity,
      price,
      image_url
    ]
  );

  const [rooms] = await pool.query(
    `SELECT *
    FROM rooms
    WHERE id = ?`,
    [result.insertId]
  );

  return rooms[0];
};

exports.getRooms = async () => {
  const [rooms] = await pool.query(
    `SELECT
      rooms.*,

      hostels.name
      AS hostel_name

    FROM rooms

    JOIN hostels
    ON rooms.hostel_id = hostels.id

    ORDER BY rooms.created_at DESC`
  );

  return rooms;
};

exports.updateRoomStatus =
  async ({
    room_id,
    status,
  }) => {
    const allowedStatuses = [
      'available',
      'occupied',
      'maintenance',
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      throw new Error(
        'Invalid room status'
      );
    }

    await pool.query(
      `UPDATE rooms
       SET status = ?
       WHERE id = ?`,
      [
        status,
        room_id,
      ]
    );

    const [rooms] = await pool.query(
      `SELECT *
       FROM rooms
       WHERE id = ?`,
      [room_id]
    );

    return rooms[0];
  };
