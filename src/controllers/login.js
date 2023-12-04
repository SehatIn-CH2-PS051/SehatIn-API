const pool = require('../db');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check registered user
    const [user] = await pool.query(
      `SELECT email, password FROM users WHERE email = ?`,
      [email]
    );

    console.log(user);

    // user is not registered
    if (user.length === 0) {
      return res.status(401).json({ message: 'email is not registered' });
    };

    // check password
    if (user[0].password !== password) {
      return res.status(401).json({ message: 'invalid password' });
    }

    return res.status(200).json({ message: 'login success!' });
  } catch (error) {
    // server error
    console.log(error);
    res.status(500).json({ message: 'there is an error on our side :(' });
  };
};

module.exports = { login };