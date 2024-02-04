const OpenAI = require('openai').default;
require('dotenv').config();
const express = require('express')
// add body parser and cors to express
const bodyParser = require('body-parser');
const cors = require('cors');

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

  try {
    // Send the message to the OpenAI assistant within the specified thread
    const openaiResponse = await openai.createMessage({
      assistant: assistantId,
      thread: threadId,
      message: {
        role: 'user',
        content: message,
      },
    });

    // Extract the assistant's response from the OpenAI response
    const assistantMessage = openaiResponse.data; // Adjust based on actual response structure

    // Log the assistant's response for debugging
    console.log('Assistant response:', assistantMessage);

    // Send the assistant's response back to the client
    res.json({ data: assistantMessage });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});