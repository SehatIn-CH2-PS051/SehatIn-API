const pool = require('../db');
const { calculateBMI, calculateBMR, getBMIInfo } = require('../helpers/bmi');
const {
  isValidGender,
  isIntegers,
  isValidActivityLevels,
  isValidGoal,
} = require('../helpers/validation');

const update = async (req, res) => {
  // allowed data to update
  const allowedData = [
    'name', 'age', 'gender', 'height',
    'weight', 'activity_level', 'goal'
  ];

  let isValidRequest = false;

  // check for valid property
  for (data in req.body) {
    if (allowedData.includes(data)) {
      isValidRequest = true;
      break;
    };
  };

  if (!isValidRequest) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'You didn\'t specify an allowed data to update.'
    });
  };

  const {
    name, age, gender, height,
    weight, activity_level, goal
  } = req.body;
  const { uid } = req;
  
  // validate age, height, weight
  if (!isIntegers(age, height, weight)) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'age, height, and weight should be in type of number.'
    });
  };

  // validate gender
  if (isValidGender(gender) === false) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'gender should only be male or female.'
    });
  };

  // validate activity level
  if (isValidActivityLevels(activity_level) === false) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'invalid activity level provided.'
    });
  };

  // validate goal
  if(isValidGoal(goal) === false) {
    return res.status(400).json({
      code: 400,
      status: 'Bad Request',
      message: 'goal should only be gain, maintain, or lose.'
    });
  };

  const [oldData] = await pool.query(
    `SELECT name, age, gender, height, weight, bmi, bmr, activity_level, goal FROM users_data
    WHERE user_id = ?`,
    [uid]
  );

  // update data
  const newData = {
    ...oldData[0],
    ...Object.fromEntries(
      Object.entries(req.body)
        .filter(([key, value]) => value !== undefined && oldData[0].hasOwnProperty(key))
    ),
  };

  // calculate new BMI, BMR and reclassify the user
  const newBMI = parseFloat(calculateBMI(newData['weight'], newData['height']).toFixed(1));
  const newBMR = calculateBMR(
    newData['weight'], newData['height'], newData['age'],
    newData['gender'], newData['activity_level']
  );
  const newClassification = getBMIInfo(newBMI);

  await pool.query(
    `UPDATE users_data
    SET
      name = ?, age = ?,
      gender = ?, height = ?,
      weight = ?, bmi = ?,
      bmr = ?, classification = ?,
      activity_level = ?, goal = ?
    WHERE user_id = ?`,
    [
      newData['name'], newData['age'], newData['gender'],
      newData['height'], newData['weight'], newBMI,
      newBMR, newClassification, newData['activity_level'],
      newData['goal'], uid
    ]
  );

  return res.status(200).json({
    code: 200,
    status: 'OK',
    message: 'Data is updated successfully.',
    data: {
      ...newData,
      bmi: newBMI,
      bmr: newBMR,
      classification: newClassification,
    }
  })
}

module.exports = { update }