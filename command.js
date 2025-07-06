import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'create',
    description: 'create a short url',
  },
];

const rest = new REST({ version: '10' }).setToken("MTA5MzU2NzEyMzkxMTA5MDIwNg.GKKEWJ.-x4DZ_xyr_PoVVwotJdH5yKryxeEtT0AYcELvU");

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands("1093567123911090206"), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}