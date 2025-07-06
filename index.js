require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userPrompt = message.content.trim();
  if (!userPrompt) return;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    message.reply(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    message.reply("Error: Gemini AI could not process your message.");
  }
});

client.login(process.env.BOT_TOKEN);

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(3000, () => {
  console.log(`Web server running on port ${3000}`);
});
