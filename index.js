require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'bot') {
    const prompt = interaction.options.getString('prompt');

    if (!prompt) {
      // Just reply (not defer) if there's no input
      return interaction.reply({
        content: '❌ Please provide a question for Ai.',
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply(); // acknowledge before processing

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = response.text();

      await interaction.editReply(text);
    } catch (error) {
      console.error('API Error:', error);

      // Edit reply instead of sending a new one
      await interaction.editReply('❌ Error: Ai could not process your message.');
    }
  }
});

client.login(process.env.BOT_TOKEN);

app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(3000, () => {
  console.log(`Web server running on port 3000`);
});
