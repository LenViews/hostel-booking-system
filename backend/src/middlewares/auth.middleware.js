const jwt = require('jsonwebtoken');

const ApiError =
require('../utils/ApiError');

exports.authenticate = (
  req,
  res,
  next
) => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    return next(
      new ApiError(
        401,
        'Access denied'
      )
    );
  }

  const token =
    authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    next(
      new ApiError(
        401,
        'Invalid token'
      )
    );
  }
};
