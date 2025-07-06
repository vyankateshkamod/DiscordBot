require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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

  if (message.content.startsWith('gemini')) {
    const userPrompt = message.content.replace('gemini', '').trim();

    if (!userPrompt) {
      return message.reply("Please provide a message for Gemini AI.");
    }

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
  } else {
    message.reply(`Hi ${message.author.username}`);
  }
});

client.login(process.env.BOT_TOKEN);
