require('dotenv').config();
const OpenAI = require('openai').default;

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function createThread() {
  try {
    const thread = await openai.beta.threads.create();
    console.log(thread);
    const threadId = thread.id;
    console.log(`Thread ID: ${threadId}`);

    // Optionally, here you could implement logic to store the threadId for future use,
    // such as saving it to an environment variable, a database, or a file.
  } catch (error) {
    console.error('Error creating thread:', error);
  }
}

createThread();
