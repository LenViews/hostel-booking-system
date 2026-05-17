const express = require('express');
const helmet = require('helmet');

const morgan = require('morgan');

const rateLimit =
require('express-rate-limit');

const errorMiddleware =
require('./middlewares/error.middleware');

const cors = require('cors');

const path = require('path');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message:
    'Too many requests, please try again later.',
});

const authRoutes =
  require('./modules/auth/auth.routes');

const {
  authenticate,
} = require('./middlewares/auth.middleware');

const roomRoutes =
  require('./modules/rooms/rooms.routes');

const bookingRoutes =
  require('./modules/bookings/bookings.routes');

const app = express();

app.use(
  '/uploads',
  express.static(
    path.join(__dirname, '../uploads')
  )
);

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(morgan('dev'));

app.use(limiter);

app.use('/api/auth', authRoutes);

app.use('/api/rooms', roomRoutes);

app.use('/api/bookings', bookingRoutes);

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

app.use(errorMiddleware);
