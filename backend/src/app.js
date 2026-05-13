const express = require('express');
const cors = require('cors');

const authRoutes =
  require('./modules/auth/auth.routes');

const {
  authenticate,
} = require('./middlewares/auth.middleware');

const roomRoutes =
  require('./modules/rooms/rooms.routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.json({
    message:
      'Hostel Booking API Running',
  });
});

app.get(
  '/api/protected',
  authenticate,
  (req, res) => {
    res.json({
      message:
        'Protected route accessed',

      user: req.user,
    });
  }
);

module.exports = app;
