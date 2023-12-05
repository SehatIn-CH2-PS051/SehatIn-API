require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

// === Controllers === //
const { register } = require('./controllers/register');
const { login } = require('./controllers/login');

const app = express();
const port = process.env.PORT || 8080;
const env = process.env.ENV;

// allow CORS from * Origin
app.use(cors());

// parse incoming request JSON payloads
app.use(express.json());

app.listen(port, () => {
  if (env === 'dev') {
    console.log(`http://localhost:${port}`);
  } else {
    console.log('Sehatin API is up and running...');
  }
});

// === ROUTES === //

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Welcome to SehatIn API!' });
});

// register a new user
app.post('/register', register);

// login to an existing account
app.post('/login', login);