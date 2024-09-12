const OpenAI = require('openai').default;
require('dotenv').config();
const express = require('express')
// add body parser and cors to express
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { messageAssistant } = require('./GPTCreation/message');
const User = require('./models/user');


// Initialize OpenAI with the API key from .env
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Initialize MongoDB with the connection string from .env
const DB_STRING = process.env.DB_STRING;

const app = express()
//can you please add cors to express
app.use(express.json());
app.use(cors());

const port = 3080

// Connect to MongoDB
mongoose.connect(DB_STRING)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering new user', error: error.message });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("Checking user", email);
    if (!user) {
      return res.status(401).json({ message: 'Login failed. User not found.' });
    }
    
    console.log("User found", user);
    
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Login failed. Wrong password.' });
    }
    console.log("Password match", isMatch);
    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret
      { expiresIn: '1h' } // Expiry in one hour, or choose a duration that fits your needs
    );
    console.log("Signing token");
    
    // Send the token to the client
    res.status(200).json({ message: 'User logged in successfully', token: token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error: error.message });
  }
});

//Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.post('/', authMiddleware, async (req, res) => {
  const { message } = req.body;
  console.log('Received message:', message);

  // Pull assistant and thread IDs from the .env file
  const assistantId = process.env.ASSISTANT_ID;
  const threadId = process.env.THREAD_ID;
  const response = await messageAssistant(message);
  res.json({ message: response.message });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});