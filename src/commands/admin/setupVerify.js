const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verify')
        .setDescription('Spawns the verification panel')
        // This keeps it out of the menu for regular members to keep the server clean
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        // --- SECURITY CHECK ---
        const ownerRoleId = process.env.OWNER_ROLE_ID;
        
        // If the user doesn't have the exact owner role, block them immediately
        if (!interaction.member.roles.cache.has(ownerRoleId)) {
            return interaction.reply({ 
                content: '❌ You do not have permission to use this command. Only the Owner can spawn this panel.', 
                ephemeral: true 
            });
        }
        // ----------------------

        const verifyChannelId = process.env.VERIFY_CHANNEL_ID;
        const channel = interaction.client.channels.cache.get(verifyChannelId);

        if (!channel) {
            return interaction.reply({ content: 'Verification channel not found! Check your .env', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#E0E7FF')
            .setTitle('🕊️ Dove Client Verification')
            .setDescription(
                'Welcome to the server! To gain full access and customize your experience, please verify your account.\n\n' +
                'Click the **Start Setup** button below to choose your ping roles and verify you are human.'
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_start')
                .setLabel('Start Setup')
                .setEmoji('✅')
                .setStyle(ButtonStyle.Primary)
        );

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Verification panel deployed!', ephemeral: true });
    }
};