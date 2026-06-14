const authService =
  require('./auth.service');

const ApiResponse =
  require('../../utils/ApiResponse');

const asyncHandler =
  require('../../utils/asyncHandler');

exports.register =
  asyncHandler(async (req, res) => {
    const user =
      await authService.register(
        req.body
      );

    res.status(201).json(
      new ApiResponse(
        201,
        'User registered successfully',
        user
      )
    );
  });

exports.login =
  asyncHandler(async (req, res) => {
    const data =
      await authService.login(
        req.body
      );

    res.status(200).json(
      new ApiResponse(
        200,
        'Login successful',
        data
      )
    );
  });
