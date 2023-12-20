const pool = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { isValidEmail } = require('../helpers/validation');
const { calculateBMI, calculateBMR, getBMIInfo } = require('../helpers/bmi');

const register = async (req, res) => {
  try {
    const {
      email, password, name,
      age, gender, height,
      weight, activity_level, goal
    } = req.body;

    // validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'Please input a valid email address!'
      });
    }

    // validate gender
    const allowedGenders = ['male', 'female'];
    if (!allowedGenders.includes(gender)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'gender should only be male or female.'
      });
    }

    // validate age, weight, height
    if (!Number.isInteger(age) || !Number.isInteger(weight) || !Number.isInteger(height)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'age, height, and weight should be in type of number.'
      });
    }

    // validate activity level
    const allowedActivityLevels = [
      'sedentary', 'lightly active', 'moderately active',
      'very active', 'extra active'
    ]
    if (!allowedActivityLevels.includes(activity_level)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'invalid activity level provided.'
      });
    }

    // validate goal
    const allowedGoals = ['gain', 'maintain', 'lose'];
    if (!allowedGoals.includes(goal)) {
      return res.status(400).json({
        code: 400,
        status: 'Bad Request',
        message: 'goal should only be gain, maintain, or lose.'
      });
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
        message: 'user already exist.'
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
    const bmr = calculateBMR(weight, height, age, gender);
    const classification = getBMIInfo(bmi);

    await pool.query(
      `INSERT INTO users_creds
      (id, email, password)
      VALUES (?, ?, ?)`,
      [uid, email, hashedPassword]
    );

    await pool.query(
      `INSERT INTO users_data
      (user_id, name, age, gender, height, weight, bmi, bmr, activity_level, classification, goal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uid, name, age, gender, height, weight, bmi, bmr, activity_level, classification, goal]
    );

    const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: 'Registration success!',
      token,
      data: {
        name, age, gender,
        height, weight, bmi,
        bmr, activity_level,
        classification, goal
      }
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

module.exports = { register };