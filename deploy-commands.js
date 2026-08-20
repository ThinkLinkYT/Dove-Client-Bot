// This MUST be the very first line
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const setupVerify = require('./src/commands/admin/setupVerify.js');
const role = require('./src/commands/utility/role.js');

// We will check multiple common names just in case!
const token = process.env.BOT_TOKEN || process.env.TOKEN || process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// 1. Double check that we actually have the variables loaded
if (!token) {
    console.error("❌ ERROR: Could not find your bot token! Make sure it is named BOT_TOKEN in your .env file.");
    process.exit(1);
}
if (!clientId) {
    console.error("❌ ERROR: Could not find CLIENT_ID in your .env file!");
    process.exit(1);
}
if (!guildId) {
    console.error("❌ ERROR: Could not find GUILD_ID in your .env file!");
    process.exit(1);
}

const commands = [setupVerify.data.toJSON(), role.data.toJSON()];
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('✅ Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('❌ Failed to deploy commands:', error);
    }
})();