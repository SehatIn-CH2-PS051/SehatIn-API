const pool = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { calculateBMI, calculateBMR, getBMIInfo } = require('../lib/bmi');

const register = async (req, res) => {
  try {
    const {
      email, password, name,
      age, gender, height,
      weight, activityLevel, goal
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

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // calculate BMI, BMR, and classify
    const bmi = parseFloat(calculateBMI(weight, height).toFixed(1));
    const bmr = calculateBMR(weight, height, age, gender, activityLevel);
    const classification = getBMIInfo(bmi);

    await pool.query(
      `INSERT INTO users
      (uid, email, password, name, age, gender, height, weight, bmi, bmr, activity_level, classification, goal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, email, hashedPassword, name, age, gender, height, weight, bmi, bmr, activityLevel, classification, goal]
    );

    const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ message: 'registration success!', token });
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).json({ message: 'there is an error on our side :(' });
  };
};

module.exports = { register };