const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pool = require('../../config/db');

exports.register = async ({
  name,
  email,
  password,
}) => {
  const [existingUsers] =
    await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

  if (existingUsers.length > 0) {
    throw new Error(
      'Email already exists'
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO users
    (
      name,
      email,
      password_hash
    )
    VALUES (?, ?, ?)`,
    [
      name,
      email,
      hashedPassword,
    ]
  );

  const [newUsers] =
    await pool.query(
      `SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = ?`,
      [result.insertId]
    );

  return newUsers[0];
};

exports.login = async ({
  email,
  password,
}) => {
  const [users] = await pool.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  const user = users[0];

  if (!user) {
    throw new Error(
      'Invalid credentials'
    );
  }

  const validPassword =
    await bcrypt.compare(
      password,
      user.password_hash
    );

  if (!validPassword) {
    throw new Error(
      'Invalid credentials'
    );
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    token,

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
