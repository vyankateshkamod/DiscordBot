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
      // Use flags instead of deprecated `ephemeral`
      return interaction.reply({
        content: '❌ Please provide a question for AI.',
        flags: 64, // ephemeral
      });
    }

    let hasDeferred = false;

    try {
      await interaction.deferReply();
      hasDeferred = true;

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = response.text();

      await interaction.editReply(text);
    } catch (error) {
      console.error('API Error:', error);

      if (hasDeferred) {
        await interaction.editReply('❌ Error: AI could not process your message.');
      } else {
        try {
          await interaction.reply({
            content: '❌ Error occurred before I could reply.',
            flags: 64,
          });
        } catch (innerErr) {
          console.error('Secondary error while replying:', innerErr.message);
        }
      }
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

// Optional: prevent crash from unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
