const express = require('express');

const {
  createRoom,
  getRooms,
  updateRoomStatus,
} = require('./rooms.controller');

const { authenticate } = require('../../middlewares/auth.middleware');

const { authorize } = require('../../middlewares/role.middleware');

const router = express.Router();

router.get('/', getRooms);

router.post('/', authenticate, authorize('admin'), createRoom);

router.patch('/:id/status', authenticate, authorize('admin'), updateRoomStatus);

module.exports = router;
