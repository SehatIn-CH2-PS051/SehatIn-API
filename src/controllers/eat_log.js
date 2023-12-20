const pool = require('../db');
const crypto = require('crypto');
const { parseNumericValue } = require('../helpers/validation');

const postEatLog = async (req, res) => {
  try {
    const { uid } = req;
    const { nama, detail, porsi } = req.body;
    const kalori = parseNumericValue(req.body.kalori);
    const Karbohidrat = parseNumericValue(detail.Karbohidrat);
    const Protein = parseNumericValue(detail.Protein);
    const Lemak = parseNumericValue(detail.Lemak);
    const image = req.body.image_url;

    // generate a unique id
    const randomBuffer = crypto.randomBytes(6);
    const id = randomBuffer.toString('hex');

    await pool.query(
      `INSERT INTO eat_logs
      (id, user_id, food, portion, calories,
        carbs, prots, fats, date, time, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?,
        CURRENT_DATE(), CURRENT_TIME(), ?)`,
      [id, uid, nama, porsi, kalori,
        Karbohidrat, Protein, Lemak, image]
    );

    const [log] = await pool.query(
      `SELECT id, food, portion, calories,
      carbs, prots, fats, message, date,
      time FROM eat_logs WHERE id = ?`,
      [id]
    );

    return res.status(200).json({
      code: 200,
      status: 'OK',
      message: 'Log successfully added.',
      image_url: image,
      data: log[0]
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

const getEatLog = async (req, res) => {
  try {
    const { uid } = req;

    const [logs] = await pool.query(
      `SELECT id, food, portion, calories,
      carbs, prots, fats, message, date,
      time, image_url FROM eat_logs WHERE user_id = ?`,
      [uid]
    );

    return res.status(200).json({
      code: 200,
      status: 'OK',
      data: logs
    })
  } catch (err) {
    // server error
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: 'Internal Server Error',
      message: 'There is an error on our side :('
    });
  }
}

module.exports = { postEatLog, getEatLog };