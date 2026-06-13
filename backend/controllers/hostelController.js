const db = require('../config/db');

const getAllHostels = async (req, res) => {
    try {
        const { search } = req.query;
        let query = `
            SELECT h.*, COUNT(r.id) as total_rooms,
                   SUM(CASE WHEN r.is_available = 1 THEN 1 ELSE 0 END) as available_rooms
            FROM hostels h
            LEFT JOIN rooms r ON h.id = r.hostel_id
        `;
        let params = [];
        
        if (search) {
            query += ' WHERE h.name LIKE ? OR h.location LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }
        
        query += ' GROUP BY h.id ORDER BY h.created_at DESC';
        
        const [hostels] = await db.query(query, params);
        res.json(hostels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHostelById = async (req, res) => {
    try {
        const [hostels] = await db.query('SELECT * FROM hostels WHERE id = ?', [req.params.id]);
        
        if (hostels.length === 0) {
            return res.status(404).json({ message: 'Hostel not found' });
        }
        
        const [rooms] = await db.query(
            'SELECT * FROM rooms WHERE hostel_id = ? ORDER BY room_number',
            [req.params.id]
        );
        
        res.json({ ...hostels[0], rooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createHostel = async (req, res) => {
    try {
        const { name, location, description, image_url } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO hostels (name, location, description, image_url) VALUES (?, ?, ?, ?)',
            [name, location, description, image_url]
        );
        
        const [newHostel] = await db.query('SELECT * FROM hostels WHERE id = ?', [result.insertId]);
        res.status(201).json(newHostel[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateHostel = async (req, res) => {
    try {
        const { name, location, description, image_url } = req.body;
        
        await db.query(
            'UPDATE hostels SET name = ?, location = ?, description = ?, image_url = ? WHERE id = ?',
            [name, location, description, image_url, req.params.id]
        );
        
        const [updated] = await db.query('SELECT * FROM hostels WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteHostel = async (req, res) => {
    try {
        await db.query('DELETE FROM hostels WHERE id = ?', [req.params.id]);
        res.json({ message: 'Hostel deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllHostels, getHostelById, createHostel, updateHostel, deleteHostel };