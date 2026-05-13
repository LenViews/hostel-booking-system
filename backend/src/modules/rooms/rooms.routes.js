const express = require('express');

const {
  createRoom,
  getRooms,
} = require('./rooms.controller');

const {
  authenticate,
} = require('../../middlewares/auth.middleware');

const {
  authorize,
} = require('../../middlewares/role.middleware');

const router = express.Router();

router.get('/', getRooms);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  createRoom
);

module.exports = router;
