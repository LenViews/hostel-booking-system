const authService =
  require('./auth.service');

exports.register = async (
  req,
  res
) => {
  try {
    const user =
      await authService.register(
        req.body
      );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.login = async (
  req,
  res
) => {
  try {
    const data =
      await authService.login(
        req.body
      );

    res.status(200).json(data);
  } catch (error) {
    res.status(401).json({
      error: error.message,
    });
  }
};
