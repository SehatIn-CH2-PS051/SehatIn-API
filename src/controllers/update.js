const pool = require('../db');
const { calculateBMI, calculateBMR, getBMIInfo } = require('../helpers/bmi');

const update = async (req, res) => {
  const { field } = req.params;
  const uid = req.uid;
  const newData = req.body[`${field}`];
  
  const allowedFields = [
    'name', 'age', 'height',
    'weight', 'activity_level', 'goal'
  ];

  // not allowed or non existing field
  if (!allowedFields.includes(field)) {
    return res.status(401).json({
      code: 401,
      status: 'Unauthorized',
      message: 'Either the field is not exist or its immutable.'
    });
  }

  // validate age, height, or weight data type
  const intFields = ['age', 'height', 'weight'];
  if (intFields.includes(field) && !Number.isInteger(newData)) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: `${field} should be in type of number.`
    });
  }

  // validate activity level
  const allowedActivityLevels = [
    'sedentary', 'lightly active', 'moderately active',
    'very active', 'extra active'
  ]
  if (field === 'activity_level' && !allowedActivityLevels.includes(newData)) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'invalid activity level provided.'
    });
  }

  // valiadate goal
  const allowedGoals = ['gain', 'maintain', 'lose'];
  if (field === 'goal' && !allowedGoals.includes(newData)) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'goal should only be gain, maintain, or lose.'
    });
  }

  // update name or goal
  if (field === 'name' || field === 'goal') {
    await pool.query(
      `UPDATE users_data
      SET
        ${field} = ?
      WHERE user = ?`,
      [newData, uid]
    );
  
    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: `${field} is updated successfully.`
    });
  }

  // update age, height, weight, activity_level and bmi, bmr, classification
  const bmiFactors = ['age', 'height', 'weight', 'activity_level'];
  if (bmiFactors.includes(field)) {
    // get user data to recalculate bmi
    const [user_data] = await pool.query(
      `SELECT age, gender, height, weight, bmr, activity_level FROM users_data WHERE user = ?`,
      [uid]
    );

    // update the old value
    const userData = {
      ...user_data[0], [field]: newData
    }

    const newBMI = parseFloat(calculateBMI(userData['weight'], userData['height']).toFixed(1));
    const newBMR = calculateBMR(
      userData['weight'], userData['height'], userData['age'],
      userData['gender'], userData['activity_level']
    );
    const newClassification = getBMIInfo(newBMI);

    await pool.query(
      `UPDATE users_data
      SET
        age = ?,
        height = ?,
        weight = ?,
        bmi = ?,
        bmr = ?,
        classification = ?,
        activity_level = ?
      WHERE user = ?`,
      [userData['age'], userData['height'], userData['weight'],
        newBMI, newBMR, newClassification, userData['activity_level'], uid]
    );

    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: `${field} is updated successfully.`
    });
  }
}

module.exports = { update }