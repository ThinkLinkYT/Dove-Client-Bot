const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Displays the official Dove Client server rules'),

    async execute(interaction) {
        const rulesEmbed = new EmbedBuilder()
            .setColor('#E0E7FF')
            .setTitle('🕊️ Dove Client | Official Rules')
            .setDescription('Welcome to the Dove Client community! To keep this space safe and welcoming, please adhere to the following rules. These apply to all parts of the server.')
            .addFields(
                { 
                    name: '🤝 1. Respect & Conduct', 
                    value: 'Treat everyone with kindness. Harassment, toxicity, discrimination, and offensive language/profanity are strictly prohibited. Please avoid sensitive topics like politics and religion.' 
                },
                { 
                    name: '🛡️ 2. Safety & Privacy', 
                    value: 'Do not share personal information or doxx anyone. Impersonation, malicious behavior, misleading information, and promoting rule-breaking or hacking are forbidden.' 
                },
                { 
                    name: '💬 3. Chat Guidelines', 
                    value: 'Use the correct channels for your topic or language. No spamming, flooding the chat, or begging.' 
                },
                { 
                    name: '🔗 4. Media & Advertising', 
                    value: 'No NSFW/pornographic content, loud disruptive media (screamers), unauthorized advertisements, or unapproved links.' 
                },
                { 
                    name: '📜 5. Discord Terms of Service', 
                    value: 'All content and behavior must strictly follow the [Discord Community Guidelines](https://discord.com/guidelines) and [Terms of Service](https://discord.com/terms).' 
                }
            )
            .setFooter({ text: 'The Dove Client Staff Team reserves the right to enforce these rules at any time.' })
            .setTimestamp();

        // Sends the embed to the channel
        await interaction.reply({ embeds: [rulesEmbed] });
    }
};