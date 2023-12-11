const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Auth');

    // use default user if there is no token
    if (!token) {
      req.uid = 'b7acaa13da2d';
      next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = decoded.uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      code: 401,
      status: 'Unauthorized',
      message: 'Invalid token.'
    })
  }
}

module.exports = { auth };