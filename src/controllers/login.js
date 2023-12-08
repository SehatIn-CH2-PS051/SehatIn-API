require('dotenv').config();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check registered user
    const [user] = await pool.query(
      `SELECT uid, email, password FROM users_creds WHERE email = ?`,
      [email]
    );

    // user is not registered
    if (user.length === 0) {
      return res.status(401).json({
        code: 401,
        status: 'Unauthorized',
        message: 'Email is not registered!'
      });
    };

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user[0]['password']);
    if (!isPasswordMatch) {
      return res.status(401).json({
        code: 401,
        status: 'Unauthorized',
        message: 'Invalid password!'
      });
    }

    const token = jwt.sign({ 'uid': user[0]['uid'] }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      code: 200,
      status: 'Ok',
      message: 'Login success!',
      token
    });
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'There is an error on our side :('
    });
  };
};

module.exports = { login };