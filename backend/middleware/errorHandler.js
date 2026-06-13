const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Duplicate entry error' });
    }
    
    res.status(500).json({ message: err.message || 'Something went wrong!' });
};

module.exports = { errorHandler };