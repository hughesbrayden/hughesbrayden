const OpenAI = require('openai').default;
require('dotenv').config();
const express = require('express')
// add body parser and cors to express
const bodyParser = require('body-parser');
const cors = require('cors');

const openai = new OpenAI();

async function main() {
  const myAssistant = await openai.beta.assistants.create({
    instructions:
      "You are a personal math tutor. When asked a question, write and run Python code to answer the question.",
    name: "Math Tutor",
    tools: [{ type: "code_interpreter" }],
    model: "gpt-3.5-turbo-1106",
  });

  console.log(myAssistant);
}

//main();

async function callAPI() {
    //insert code here to call the assistant API
    console.log('calling API...')
}



const app = express()
//can you please add cors to express
app.use(bodyParser.json());
app.use(cors());

const port = 3080


app.post('/', async (req, res) => {
    //insert function code once function is done
    //res.json({ data: 'respone.data from openai'})
    const { message } = req.body;
    console.log(message);
    res.json({ data: message, })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});