const pool = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { isValidEmail } = require('../lib/validation');
const { calculateBMI, calculateBMR, getBMIInfo } = require('../lib/bmi');

const register = async (req, res) => {
  try {
    const {
      email, password, name,
      age, gender, height,
      weight, activityLevel, goal
    } = req.body;

    // validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Please input a valid email address!'
      })
    }

    // validate gender
    if (!gender || gender !== 'male' && gender !== 'female') {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Gender should only be male or female!'
      })
    }

    // validate age, weight, height
    if (!Number.isInteger(age) || !Number.isInteger(weight) || !Number.isInteger(height)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Invalid data type(s)!'
      })
    }

    // validate goal
    if (!goal || goal !== 'gain' && goal !== 'maintain' && goal !== 'lose') {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Goal should only be gain, maintain, or lose!'
      })
    }

    // check existing user
    const [user] = await pool.query(
      `SELECT email FROM users_creds WHERE email = ?`,
      [email]
    );

    // user already existed
    if (user.length > 0) {
      return res.status(409).json({
        code: 409,
        status: 'Conflict',
        message: 'User already exist!'
      });
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
      `INSERT INTO users_creds
      (uid, email, password)
      VALUES (?, ?, ?)`,
      [uid, email, hashedPassword]
    );

    await pool.query(
      `INSERT INTO users_data
      (user, name, age, gender, height, weight, bmi, bmr, activity_level, classification, goal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, name, age, gender, height, weight, bmi, bmr, activityLevel, classification, goal]
    );

    const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      code: 200,
      Status: 'Ok',
      message: 'Registration success!',
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

module.exports = { register };