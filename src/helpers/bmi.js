const calculateBMI = (weight, height) => {
  // convert height from centimeters to meters
  const heightInMeters = height / 100;

  const bmi = weight / Math.pow(heightInMeters, 2);
  return bmi;
}

const calculateBMR = (weight, height, age, gender, activityLevel) => {
  if (gender.toLowerCase() === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5.0 * age) + 5;
  } else if (gender.toLowerCase() === 'female') {
    bmr = (10 * weight) + (6.25 * height) - (5.0 * age) - 161;
  } else {
    throw new Error("Invalid gender provided. Please input 'male' or 'female'.");
  }

  const activityFactors = {
    'sedentary': 1.2, // little to no exercise, desk job
    'lightly active': 1.375, // exercise 1 to 3 days per week
    'moderately active': 1.55, // exercise 3 to 5 days per week
    'very active': 1.725, // exercise 6 to 7 days per week
    'extra active': 1.9 // exercise 2x per day
  };

  if (activityFactors.hasOwnProperty(activityLevel.toLowerCase())) {
    bmr *= activityFactors[activityLevel.toLowerCase()];
  } else {
    throw new Error("Invalid activity level provided.");
  }

  return bmr;
}

const getBMIInfo = (bmi) => {
  if (bmi < 18.5) return "underweight";
  else if (18.5 <= bmi && bmi <= 22.9) {
    return "normal";
  } else if (23.0 <= bmi && bmi <= 27.4) {
    return "mild overweight";
  } else return "obese";
}

const calculateCalorieIntake = (bmr, goal) => {
  if (goal === 'maintain') {
    return bmr;
  } else if (goal === 'lose') {
    return bmr - 1000;
  } else if (goal === 'gain') {
    return bmr + 1000;
  }
};

module.exports = {
  calculateBMI,
  calculateBMR,
  getBMIInfo,
  calculateCalorieIntake,
};