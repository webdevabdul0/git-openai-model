import express from "express";
import OpenAI from "openai";
import 'dotenv/config';

const app = express();
app.use(express.json());

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const client = new OpenAI({ baseURL: endpoint, apiKey: token });

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "Hello!";

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

    res.json({ reply: response.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
