const OpenAI = require('openai').default;
require('dotenv').config({ path: '../.env' });

const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function createMessage(content) {
    console.log("Creating a message in the thread...");
    const response = await openai.beta.threads.messages.create(process.env.THREAD_ID, { role: "user", content });
    console.log("Message created, ID:", response.id);
    return response;
}
  
async function initiateRun() {
    console.log("Initiating a run with the assistant...");
    const response = await openai.beta.threads.runs.create(process.env.THREAD_ID, { assistant_id: process.env.ASSISTANT_ID });
    console.log("Run initiated, ID:", response.id);
    return response;
}
  
async function waitForRunCompletion(runId) {
    let runStatus = 'in_progress';
    console.log("Checking the run status...");
  
    // Move the run status check to the beginning of the loop
    do {
      const response = await openai.beta.threads.runs.retrieve(process.env.THREAD_ID, runId);
      runStatus = response.status;
      console.log("Current run status:", runStatus);
  
      // Wait for 1 second before the next check only if the run is not completed
      if (runStatus !== "completed") {
        console.log("Waiting for 1 second before the next status check...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } while (runStatus !== "completed");
}
  
  
async function retrieveLatestMessage() {
    console.log("Run completed. Retrieving the latest message...");
    const messagesResponse = await openai.beta.threads.messages.list(process.env.THREAD_ID);
    const messages = messagesResponse.data;
    if (messages && messages.length > 0) {
      return messages[0]; // Assuming the first message is the latest
    }
    return null;
}
  
async function messageAssistant(messageContent) {
    const startTime = new Date();
    try {
      await createMessage(messageContent);
      const runResponse = await initiateRun();
      await waitForRunCompletion(runResponse.id);
      const latestResponse = await retrieveLatestMessage();
  
      if (latestResponse && latestResponse.content && latestResponse.content.length > 0 && latestResponse.content[0].type === 'text') {
        console.log(latestResponse.content[0].text.value);
      } else {
        console.log("No latest response or content in an unrecognized format.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      const endTime = new Date();
      const runTime = endTime - startTime;
      console.log(`Total run time: ${runTime}ms`);
    }
}
  
module.exports = { messageAssistant }; // Export the function for use in other modules
  
  


