const pool = require('../db');
const crypto = require('crypto');
const { parseNumericValue } = require('../helpers/validation');

const eatLog = async (req, res) => {
  try {
    const { uid } = req;
    const { nama, detail, kalori, porsi } = req.body;
    const { Karbohidrat, Protein, Lemak } = detail;

    // generate a unique id
    const randomBuffer = crypto.randomBytes(6);
    const id = randomBuffer.toString('hex');

    await pool.query(
      `INSERT INTO eat_logs
      (id, user_id, food, portion, calories, carbs, prots, fats, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_DATE(), CURRENT_TIME())`,
      [
        id, uid, nama, porsi,
        parseNumericValue(kalori),
        parseNumericValue(Karbohidrat),
        parseNumericValue(Protein),
        parseNumericValue(Lemak)
      ]
    );

    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: 'Log successfully added.'
    });
  } catch (err) {
    // server error
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'There is an error on our side :('
    });
  }
};

module.exports = { eatLog };