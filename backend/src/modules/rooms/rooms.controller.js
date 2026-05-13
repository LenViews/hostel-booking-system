const roomService =
  require('./rooms.service');

exports.createRoom = async (
  req,
  res
) => {
  try {
    const room =
      await roomService.createRoom(
        req.body
      );

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.getRooms = async (
  req,
  res
) => {
  try {
    const rooms =
      await roomService.getRooms();

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
