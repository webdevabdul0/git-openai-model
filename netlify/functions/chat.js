'use strict';
const OpenAI = require('openai');
require('dotenv').config();

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let userMessage = 'Hello!';
  try {
    const body = JSON.parse(event.body);
    userMessage = body.message || userMessage;
  } catch (e) {}

  try {
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage }
      ],
      temperature: 1.0,
      top_p: 1.0,
      model: model
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"  // ✅ this makes sure response is parsed as JSON
      },
      body: JSON.stringify({ reply: response.choices[0].message.content })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message, details: err.response?.data })
    };
  }
};
