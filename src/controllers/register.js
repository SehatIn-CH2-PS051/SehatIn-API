const pool = require('../db');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const {
      email, password, name, age,
      gender, height, weight, goal
    } = req.body;

    // check existing user
    const [user] = await pool.query(
      `SELECT email FROM users WHERE email = ?`,
      [email]
    );

    // user already existed
    if (user.length > 0) {
      return res.status(409).json({ message: 'user already existed' });
    };

    // generate a unique id
    const randomBuffer = crypto.randomBytes(6);
    const uid = randomBuffer.toString('hex');

    await pool.query(
      `INSERT INTO users
      (uid, email, password, name, age, gender, height, weight, goal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, email, password, name, age, gender, height, weight, goal]
    );

    res.status(200).json({ message: 'registration success!' });
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).json({ message: 'there is an error on our side :(' });
  };
};

module.exports = { register };