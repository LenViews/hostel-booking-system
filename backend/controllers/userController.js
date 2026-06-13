const db = require('../config/db');
const bcrypt = require('bcryptjs');

const updateProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userId = req.user.id;
        
        let updateQuery = 'UPDATE users SET name = ?, email = ?';
        let params = [name, email];
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateQuery += ', password_hash = ?';
            params.push(hashedPassword);
        }
        
        updateQuery += ' WHERE id = ?';
        params.push(userId);
        
        await db.query(updateQuery, params);
        
        const [users] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId]);
        res.json({ message: 'Profile updated successfully', user: users[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile };