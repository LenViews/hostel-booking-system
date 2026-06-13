// roomRoutes.js
const express = require('express');
const { getRoomById, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/:id', getRoomById);
router.post('/hostel/:hostelId', protect, admin, createRoom);
router.put('/:id', protect, admin, updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;