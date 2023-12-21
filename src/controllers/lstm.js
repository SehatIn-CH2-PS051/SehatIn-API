const axios = require('axios');

const lstm = async (req, res) => {
  try {
    const user_id = req.uid;

    const predictEatPattern = await axios.post(
      `${process.env.LSTM_API}/predict-pm`,
      { user_id },
    );

    const predictLSTM = await axios.post(
      `${process.env.LSTM_API}/predict-lstm`,
      { user_id },
    );
    
    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: {
        ...predictEatPattern.data,
        ...predictLSTM.data
      }
    })
  } catch (err) {
    return res.json({ error: err.message });
  };
};

module.exports = { lstm };