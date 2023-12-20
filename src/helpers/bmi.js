const calculateBMI = (weight, height) => {
  // convert height from centimeters to meters
  const heightInMeters = height / 100;

  const bmi = weight / Math.pow(heightInMeters, 2);
  return bmi;
}

const calculateBMR = (weight, height, age, gender) => {
  if (gender.toLowerCase() === 'male') 
    return (10 * weight) + (6.25 * height) - (5.0 * age) + 5;
  
  if (gender.toLowerCase() === 'female') 
    return (10 * weight) + (6.25 * height) - (5.0 * age) - 161;
}

const getBMIInfo = (bmi) => {
  if (bmi < 18.5) return "underweight";
  else if (18.5 <= bmi && bmi <= 22.9) {
    return "normal";
  } else if (23.0 <= bmi && bmi <= 27.4) {
    return "mild overweight";
  } else return "obese";
}

const calculateCalorieIntake = (bmr, activity_level) => {
  if (activity_level === 'sedentary') 
    return bmr * 1.2;
  if (activity_level === 'lightly active') 
    return bmr * 1.375;
  if (activity_level === 'moderately active') 
    return bmr * 1.55;
  if (activity_level === 'very active')
    return bmr * 1.725;
  if (activity_level === 'extra active')
    return bmr * 1.9;
};

module.exports = {
  calculateBMI,
  calculateBMR,
  getBMIInfo,
  calculateCalorieIntake,
};