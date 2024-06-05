const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const cors = require('cors');  // Import cors
const app = express();

app.use(cors({
  origin: 'http://localhost:8080',  // Allow only the frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true  // Allow cookies to be sent with requests
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/led_control', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  permissions: [String],
});

const User = mongoose.model('User', UserSchema);

// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(401).send('Unauthorized');
  }
};

// Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, password, permissions } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = new User({
    username,
    password: hashedPassword,
    permissions
  });

  try {
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user._id, permissions: user.permissions }, 'your_jwt_secret');
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to check permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (req.user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).send('Forbidden');
    }
  };
};

// Endpoint to control LED
app.post('/led/:action', authMiddleware, checkPermission('control_led'), async (req, res) => {
  const action = req.params.action;
  try {
    const response = await axios.post(`http://localhost:5000/led/${action}`);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error controlling LED');
  }
});

// Endpoint to fetch IO status
app.get('/io/status', authMiddleware, async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/io/status');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching IO status');
  }
});

app.listen(3000, () => {
  console.log('Express server running on port 3000');
});
