const db = require('../config/db');

const getRoomById = async (req, res) => {
    try {
        const [rooms] = await db.query(
            'SELECT r.*, h.name as hostel_name, h.location FROM rooms r JOIN hostels h ON r.hostel_id = h.id WHERE r.id = ?',
            [req.params.id]
        );
        
        if (rooms.length === 0) {
            return res.status(404).json({ message: 'Room not found' });
        }
        
        res.json(rooms[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRoom = async (req, res) => {
    try {
        const { room_number, type, price, capacity, is_available, image_url, description } = req.body;
        const hostel_id = req.params.hostelId;
        
        const [result] = await db.query(
            `INSERT INTO rooms (hostel_id, room_number, type, price, capacity, is_available, image_url, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [hostel_id, room_number, type, price, capacity, is_available !== false, image_url, description]
        );
        
        const [newRoom] = await db.query('SELECT * FROM rooms WHERE id = ?', [result.insertId]);
        res.status(201).json(newRoom[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRoom = async (req, res) => {
    try {
        const { room_number, type, price, capacity, is_available, image_url, description } = req.body;
        
        await db.query(
            `UPDATE rooms SET room_number = ?, type = ?, price = ?, capacity = ?, 
             is_available = ?, image_url = ?, description = ? WHERE id = ?`,
            [room_number, type, price, capacity, is_available, image_url, description, req.params.id]
        );
        
        const [updated] = await db.query('SELECT * FROM rooms WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRoom = async (req, res) => {
    try {
        await db.query('DELETE FROM rooms WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoomById, createRoom, updateRoom, deleteRoom };