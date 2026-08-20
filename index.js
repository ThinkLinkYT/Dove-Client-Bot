require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');

// 1. Initialize Client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Required for welcome/leave
        GatewayIntentBits.GuildMessages,
    ]
});

// 2. Dynamically load all events from the src/events folder
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// ... your other index.js code ...

const startGitHubWebhook = require('./src/webhooks/github.js');

client.once('ready', () => {
    // Start the web server once the bot is fully online
    startGitHubWebhook(client);
});

// 3. Log in to Discord
client.login(process.env.BOT_TOKEN);

// 3. Log in to Discord
client.login(process.env.BOT_TOKEN);