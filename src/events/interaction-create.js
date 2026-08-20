const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // --- 1. HANDLE SLASH COMMANDS ---
        if (interaction.isChatInputCommand()) {
            // Note: In a full handler, you'd dynamically map commands. 
            // For now, we manually route the two commands we made.
            // --- 1. HANDLE SLASH COMMANDS ---
        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === 'setup-verify') {
                const command = require('../commands/admin/setupVerify.js');
                await command.execute(interaction);
            } else if (interaction.commandName === 'role') {
                const command = require('../commands/utility/role.js');
                await command.execute(interaction);
            } else if (interaction.commandName === 'rules') { // <-- ADD THIS BLOCK
                const command = require('../commands/utility/rules.js');
                await command.execute(interaction);
            }
            return;
        }
            return;
        }

        // --- 2. HANDLE VERIFICATION BUTTONS ---
        if (interaction.isButton()) {
            const member = interaction.member;

            // Helper to generate Yes/No buttons for a specific step
            const getRow = (stepName) => new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId(`verify_${stepName}_yes`).setLabel('Yes').setEmoji('✅').setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId(`verify_${stepName}_no`).setLabel('No').setEmoji('❌').setStyle(ButtonStyle.Danger)
            );

            // Step 1: User clicks "Start Setup"
            if (interaction.customId === 'verify_start') {
                const embed = new EmbedBuilder().setColor('#E0E7FF').setTitle('Step 1/3: Announcements')
                    .setDescription('Would you like to receive pings for 📢 **Server Announcements**?');
                await interaction.reply({ embeds: [embed], components: [getRow('announcements')], ephemeral: true });
            }

            // Step 2: Handle Announcements answer & Ask Giveaways
            else if (interaction.customId.startsWith('verify_announcements_')) {
                if (interaction.customId.endsWith('_yes')) await member.roles.add(process.env.ANNOUNCEMENT_ROLE_ID).catch(() => {});
                
                const embed = new EmbedBuilder().setColor('#E0E7FF').setTitle('Step 2/3: Giveaways')
                    .setDescription('Would you like to receive pings for 🎁 **Giveaways**?');
                await interaction.update({ embeds: [embed], components: [getRow('giveaways')] });
            }

            // Step 3: Handle Giveaways answer & Ask Updates
            else if (interaction.customId.startsWith('verify_giveaways_')) {
                if (interaction.customId.endsWith('_yes')) await member.roles.add(process.env.GIVEAWAY_ROLE_ID).catch(() => {});
                
                const embed = new EmbedBuilder().setColor('#E0E7FF').setTitle('Step 3/3: Client Updates')
                    .setDescription('Would you like to receive pings for 🔄 **Dove Client Updates**?');
                await interaction.update({ embeds: [embed], components: [getRow('updates')] });
            }

            // Step 4: Handle Updates answer & Ask Robot Check
            else if (interaction.customId.startsWith('verify_updates_')) {
                if (interaction.customId.endsWith('_yes')) await member.roles.add(process.env.UPDATES_ROLE_ID).catch(() => {});
                
                const embed = new EmbedBuilder().setColor('#E0E7FF').setTitle('Final Step: Anti-Bot Check')
                    .setDescription('Please confirm you are human to complete verification and gain access to the server.');
                
                const finalRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('verify_robot').setLabel('I am not a robot').setEmoji('✅').setStyle(ButtonStyle.Primary)
                );
                await interaction.update({ embeds: [embed], components: [finalRow] });
            }

            // Step 5: Final Verification 
            else if (interaction.customId === 'verify_robot') {
                await member.roles.add(process.env.MEMBER_ROLE_ID).catch(() => {});
                
                const embed = new EmbedBuilder().setColor('#43B581').setTitle('Verification Complete!')
                    .setDescription('🕊️ You are now verified. Welcome to Dove Client!');
                
                // Clear the buttons and show success
                await interaction.update({ embeds: [embed], components: [] });
            }
        }
    },
};