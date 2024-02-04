const OpenAI = require('openai').default;
require('dotenv').config(); 
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function createAssistant() {
    try {
      const assistant = await openai.beta.assistants.create({
        instructions: "You are a helpful assistant.",
        name: "My Assistant",
        tools: [],
        model: "gpt-3.5-turbo-1106",
      });
  
      console.log(assistant);
      const assistantId = assistant.id;
      console.log(`Assistant ID: ${assistantId}`);
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  }
  
createAssistant();