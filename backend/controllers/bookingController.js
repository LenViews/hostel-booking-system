const db = require('../config/db');

const checkRoomAvailability = async (room_id, start_date, end_date, excludeBookingId = null) => {
    let query = `
        SELECT COUNT(*) as count FROM bookings 
        WHERE room_id = ? AND status = 'active'
        AND start_date < ? AND end_date > ?
    `;
    let params = [room_id, end_date, start_date];
    
    if (excludeBookingId) {
        query += ' AND id != ?';
        params.push(excludeBookingId);
    }
    
    const [result] = await db.query(query, params);
    return result[0].count === 0;
};

const createBooking = async (req, res) => {
    try {
        const { room_id, start_date, end_date } = req.body;
        const student_id = req.user.id;
        
        // Validate dates
        const today = new Date().toISOString().split('T')[0];
        if (start_date < today) {
            return res.status(400).json({ message: 'Start date cannot be in the past' });
        }
        if (start_date > end_date) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }
        
        // Check room exists and is available
        const [rooms] = await db.query('SELECT * FROM rooms WHERE id = ? AND is_available = 1', [room_id]);
        if (rooms.length === 0) {
            return res.status(400).json({ message: 'Room is not available' });
        }
        
        // Check for double booking
        const isAvailable = await checkRoomAvailability(room_id, start_date, end_date);
        if (!isAvailable) {
            return res.status(400).json({ message: 'Room is already booked for these dates' });
        }
        
        // Create booking
        const [result] = await db.query(
            'INSERT INTO bookings (student_id, room_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
            [student_id, room_id, start_date, end_date, 'active']
        );
        
        const [booking] = await db.query(
            `SELECT b.*, r.room_number, r.type, r.price, h.name as hostel_name 
             FROM bookings b 
             JOIN rooms r ON b.room_id = r.id 
             JOIN hostels h ON r.hostel_id = h.id 
             WHERE b.id = ?`,
            [result.insertId]
        );
        
        res.status(201).json(booking[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        
        let query = 'SELECT * FROM bookings WHERE id = ?';
        let params = [bookingId];
        
        if (userRole !== 'admin') {
            query += ' AND student_id = ?';
            params.push(userId);
        }
        
        const [bookings] = await db.query(query, params);
        
        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        const booking = bookings[0];
        
        // Check if booking can be cancelled (not in past)
        const today = new Date().toISOString().split('T')[0];
        if (booking.start_date < today && booking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Cannot cancel past bookings' });
        }
        
        await db.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', bookingId]);
        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, r.room_number, r.type, r.price, r.image_url, h.name as hostel_name, h.location 
             FROM bookings b 
             JOIN rooms r ON b.room_id = r.id 
             JOIN hostels h ON r.hostel_id = h.id 
             WHERE b.student_id = ? 
             ORDER BY b.start_date DESC`,
            [req.user.id]
        );
        
        const active = bookings.filter(b => b.status === 'active' && new Date(b.end_date) >= new Date());
        const history = bookings.filter(b => b.status === 'cancelled' || new Date(b.end_date) < new Date());
        
        res.json({ active, history });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.query(
            `SELECT b.*, u.name as student_name, u.email as student_email,
                    r.room_number, r.type, h.name as hostel_name
             FROM bookings b 
             JOIN users u ON b.student_id = u.id 
             JOIN rooms r ON b.room_id = r.id 
             JOIN hostels h ON r.hostel_id = h.id 
             ORDER BY b.created_at DESC`
        );
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, cancelBooking, getMyBookings, getAllBootings: getAllBookings };