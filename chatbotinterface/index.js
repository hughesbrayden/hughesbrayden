const OpenAI = require('openai').default;
require('dotenv').config();
const express = require('express')
// add body parser and cors to express
const bodyParser = require('body-parser');
const cors = require('cors');
const { messageAssistant } = require('./GPTCreation/message');

// Initialize OpenAI with the API key from .env
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const app = express()
//can you please add cors to express
app.use(bodyParser.json());
app.use(cors());

const port = 3080

app.post('/', async (req, res) => {
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