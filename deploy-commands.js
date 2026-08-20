// This MUST be the very first line
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN || process.env.TOKEN || process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// 1. Validate variables
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

const commands = [];

// 2. Dynamically grab all command files from the src/commands directory
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    // Grab all files inside the category folder (e.g., admin, utility)
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    // Loop through the files and add them to the deployment array
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        // Failsafe: Ensure the file is actually a valid command before pushing it
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`⚠️ [WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const rest = new REST({ version: '10' }).setToken(token);

// 3. Deploy to Discord
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