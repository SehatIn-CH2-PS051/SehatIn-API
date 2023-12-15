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
        message: 'Email is not registered.'
      });
    };

    // check password
    const isPasswordMatch = await bcrypt.compare(password, user[0]['password']);
    if (!isPasswordMatch) {
      return res.status(401).json({
        code: 401,
        status: 'Unauthorized',
        message: 'Invalid password.'
      });
    }

    // get user's data
    const [userData] = await pool.query(
      `SELECT name, age, gender, height, weight, bmi, bmr, activity_level, classification, goal
      FROM users_data WHERE uid = ?`,
      [user[0]['uid']]
    );

    const token = jwt.sign({ 'uid': user[0]['uid'] }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: 'Login success.',
      token,
      data: userData[0]
    });
  } catch (err) {
    // server error
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'There is an error on our side :('
    });
  };
};

module.exports = { login };