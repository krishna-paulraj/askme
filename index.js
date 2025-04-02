const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API,
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(201).json({ error: "message is required" });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: "My name is krishna" }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const response = await chat.sendMessage({
      message: message,
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.post("/generate", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(201).json({ error: "message is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: message,
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ status: "running" });
});

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});
