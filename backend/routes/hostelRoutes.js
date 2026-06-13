// hostelRoutes.js
const express = require('express');
const { getAllHostels, getHostelById, createHostel, updateHostel, deleteHostel } = require('../controllers/hostelController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', getAllHostels);
router.get('/:id', getHostelById);
router.post('/', protect, admin, createHostel);
router.put('/:id', protect, admin, updateHostel);
router.delete('/:id', protect, admin, deleteHostel);

module.exports = router;