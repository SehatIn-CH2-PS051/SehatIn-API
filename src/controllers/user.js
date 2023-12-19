const pool = require('../db');
const { calculateCalorieIntake } = require('../helpers/bmi');

const getUserData = async (req, res) => {
  const { uid } = req;

  // get the user data
  const [userData] = await pool.query(
    `SELECT name, age, gender, height, weight, bmi, bmr, classification, activity_level, goal
    FROM users_data WHERE user_id = ?`,
    [uid]
  );

  const calorieIntake = calculateCalorieIntake(userData[0]['bmr'], userData[0]['goal']);
  console.log(calorieIntake);

  return res.status(200).json({
    code: 200,
    status: 'OK',
    user: userData,
    calorie_intake: calorieIntake
  });
};

module.exports = { getUserData };