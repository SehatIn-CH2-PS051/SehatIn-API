require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { auth } = require('./helpers/auth');

const app = express();
const port = process.env.PORT || 8080;
const env = process.env.ENV;

// Multer configuration for handling file uploads
const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

// allow CORS from * Origin
app.use(cors());
// parse incoming request JSON payloads
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

app.listen(port, () => {
  if (env === 'dev') {
    console.log(`http://localhost:${port}`);
  } else {
    console.log('Sehatin API is up and running...');
  }
});

// === ROUTES === //
app.get('/', async (req, res) => {
  res.status(200).json({
    code: 200,
    status: 'OK',
    message: 'Welcome to SehatIn API!'
  });
});

// register a new user
const { register } = require('./controllers/register');
app.post('/register', register);

// login to an existing account
const { login } = require('./controllers/login');
app.post('/login', login);

// get user's data
const { getUserData } = require('./controllers/user');
app.get('/user', auth, getUserData);

// update user's data
const { update } = require('./controllers/update');
app.put('/user', auth, update);

// get food's data
const { food } = require('./controllers/food');
app.post('/food', auth, multerUpload.single('file'), food);

// post eating logs
const { postEatLog } = require('./controllers/eat_log');
app.post('/eat-log', auth, postEatLog);

// get eating logs
const { getEatLog } = require('./controllers/eat_log');
app.get('/eat-log', auth, getEatLog);

// get eating pattern & predicted values chart
const { lstm } = require('./controllers/lstm');
app.get('/lstm', auth, lstm);