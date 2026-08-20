const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Add or remove your ping roles')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Do you want to add or remove the role?')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                ))
        .addStringOption(option => 
            option.setName('type')
                .setDescription('Which role?')
                .setRequired(true)
                .addChoices(
                    // We added || '0' so that if the .env is missing, it falls back to a string instead of crashing!
                    { name: '📢 Announcements', value: process.env.ANNOUNCEMENT_ROLE_ID || '0' },
                    { name: '🎁 Giveaways', value: process.env.GIVEAWAY_ROLE_ID || '0' },
                    { name: '🔄 Updates', value: process.env.UPDATES_ROLE_ID || '0' }
                )),

    async execute(interaction) {
        const action = interaction.options.getString('action');
        const roleId = interaction.options.getString('type');
        
        // Failsafe if the .env was empty
        if (roleId === '0') {
            return interaction.reply({ content: 'Error: The role IDs are not set up in the .env file correctly!', ephemeral: true });
        }

        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({ content: 'Role not found in the server.', ephemeral: true });
        }

        try {
            if (action === 'add') {
                await interaction.member.roles.add(role);
                await interaction.reply({ content: `✅ Successfully gave you the **${role.name}** role!`, ephemeral: true });
            } else {
                await interaction.member.roles.remove(role);
                await interaction.reply({ content: `✅ Successfully removed the **${role.name}** role!`, ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'I do not have permission to manage that role. Check my role hierarchy!', ephemeral: true });
        }
    }
};