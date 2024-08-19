require('dotenv').config();
const express = require('express');
const { NlpManager } = require('node-nlp');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

const nlpManager = new NlpManager({ languages: ['en'] });
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/process', async (req, res) => {
  const { input } = req.body;
  
  // Process input with NLP
  const result = await nlpManager.process('en', input);
  
  // Generate response with OpenAI
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `Based on the input: "${input}", and the NLP result: ${JSON.stringify(result)}, generate an appropriate response:`,
    max_tokens: 100
  });
  
  res.json({ response: completion.data.choices[0].text.trim() });
});

app.listen(port, () => {
  console.log(`AI agent listening at http://localhost:${port}`);
});