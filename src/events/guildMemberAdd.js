const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Fetch the welcome channel ID from your .env
        const channelId = process.env.WELCOME_CHANNEL_ID;
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) return; // Failsafe if the channel isn't found

        // Create a clean, organized embed
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#E0E7FF') // A soft, clean "Dove" white/blue color
            .setAuthor({ 
                name: `${member.user.tag} joined the server!`, 
                iconURL: member.user.displayAvatarURL({ dynamic: true }) 
            })
            .setTitle('Welcome to Dove Client 🕊️')
            .setDescription(
                `Hello ${member}! Welcome to the official **Dove Client** community.\n\n` +
                `> 📥 **Releases:** Check out the latest client updates.\n` +
                `> 💬 **Support:** Need help? Open a ticket or ask the community.\n\n` +
                `We are thrilled to have you here!`
            )
            .setThumbnail(member.user.displayAvatarURL({ size: 512, dynamic: true })) // Large profile picture
            .setFooter({ text: `You are member #${member.guild.memberCount}` })
            .setTimestamp();

        try {
            // Send the message and auto-react
            const message = await channel.send({ 
                content: `Welcome, ${member}!`, // Pings the user outside the embed so they get a notification
                embeds: [welcomeEmbed] 
            });
            await message.react('👋');
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    },
};