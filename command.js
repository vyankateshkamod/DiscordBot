require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('bot')
    .setDescription('Ask AI anything')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('Your message for Ai')
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log('⏳ Registering slash command...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash command registered!');
  } catch (err) {
    console.error('❌ Error registering slash command:', err);
  }
})();
