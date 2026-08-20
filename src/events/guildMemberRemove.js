const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        // Fetch the leave channel ID from your .env
        const channelId = process.env.LEAVE_CHANNEL_ID;
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) return;

        // Create a subtle, clean leave embed
        const leaveEmbed = new EmbedBuilder()
            .setColor('#2B2D31') // Discord's dark theme background color to look blended and clean
            .setAuthor({ 
                name: `${member.user.tag} left the server`, 
                iconURL: member.user.displayAvatarURL({ dynamic: true }) 
            })
            .setDescription(`**${member.user.username}** has departed.\n\nSafe travels from the Dove Client team! 🕊️`)
            .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true }))
            .setFooter({ text: `We now have ${member.guild.memberCount} members` })
            .setTimestamp();

        try {
            // Send the message and auto-react
            const message = await channel.send({ embeds: [leaveEmbed] });
            await message.react('👋');
        } catch (error) {
            console.error('Error sending leave message:', error);
        }
    },
};