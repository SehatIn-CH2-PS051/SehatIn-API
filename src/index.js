require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

// === Controllers === //
const { register } = require('./controllers/register');
const { login } = require('./controllers/login');

const app = express();
const port = process.env.PORT || 8080;

// allow CORS from * Origin
app.use(cors());

// parse incoming request JSON payloads
app.use(express.json());

app.listen(port, () => {
  console.log(`Sehatin API listening on port ${port}`);
});

// === ROUTES === //

app.get('/', async (req, res) => {
  res.status(200).json({ message: 'Welcome to SehatIn API!' });
});

// register a new user
app.post('/register', register);

// login to an existing account
app.post('/login', login);