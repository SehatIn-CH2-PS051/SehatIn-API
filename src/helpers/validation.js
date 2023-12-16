const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidGender = (gender) => {
  if (!gender) return null;
  if (gender !== 'male' && gender !== 'female') {
    return false;
  };
  return true;
};

const isIntegers = (...args) => {
  for (const arg of args) {
    if (arg && !Number.isInteger(arg)) {
      return false;
    };
  };
  return true;
};

const isValidActivityLevels = (level) => {
  if (!level) return null;

  const allowedActivityLevels = [
    'sedentary', 'lightly active', 'moderately active',
    'very active', 'extra active'
  ]

  if (!allowedActivityLevels.includes(level)) {
    return false;
  }
  return true;
};

const isValidGoal = (goal) => {
  if (!goal) return null;
  const allowedGoals = ['gain', 'maintain', 'lose'];
  if (!allowedGoals.includes(goal)) return false;
  return true;
};

const parseNumericValue = (inputString) => {
  // Use a regular expression to extract numeric values
  const matches = inputString.match(/(\d+(\,\d+)?)|(\d+)/);

  if (matches && matches[0]) {
    // Replace comma with dot and parse as a float
    const numericValue = matches[0].replace(',', '.');
    return parseFloat(numericValue);
  }

  // Return NaN if no numeric value is found
  return NaN;
}

module.exports = {
  isValidEmail,
  isValidGender,
  isIntegers,
  isValidActivityLevels,
  isValidGoal,
  parseNumericValue
};