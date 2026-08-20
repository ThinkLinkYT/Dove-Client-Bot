const express = require('express');
const crypto = require('crypto');
const { EmbedBuilder } = require('discord.js');

module.exports = function startGitHubWebhook(client) {
    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware to capture the raw body for signature verification
    app.use(express.json({
        verify: (req, res, buf) => { req.rawBody = buf; }
    }));

    // Security check: Verify the payload came from GitHub using your secret
    const verifySignature = (req, res, next) => {
        const signature = req.headers['x-hub-signature-256'];
        const secret = process.env.WEBHOOK_GITHUB_SECRET;

        if (!signature || !secret) return res.status(401).send('Unauthorized or Missing Secret');

        const hmac = crypto.createHmac('sha256', secret);
        const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');

        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
            next(); // Signature matches, proceed!
        } else {
            res.status(401).send('Invalid signature');
        }
    };

    // The endpoint GitHub will send data to
    app.post('/github', verifySignature, async (req, res) => {
        res.sendStatus(200); // Tell GitHub we got it immediately

        const event = req.headers['x-github-event'];
        const payload = req.body;
        
        // Failsafes to prevent crashes if the payload is weird
        if (!payload.repository || !payload.sender) return;

        const channelId = process.env.BOT_UPDATES_CHANNEL_ID;
        const channel = client.channels.cache.get(channelId);
        if (!channel) return console.error('GitHub Webhook: Could not find update channel!');

        // Build a dynamic embed that supports ALL event types
        const embed = new EmbedBuilder()
            .setColor('#24292e') // GitHub dark color
            .setAuthor({ 
                name: payload.sender.login, 
                iconURL: payload.sender.avatar_url, 
                url: payload.sender.html_url 
            })
            .setTitle(`[${payload.repository.name}] New ${event} event`)
            .setURL(payload.repository.html_url)
            .setTimestamp();

        // Custom formatting for common events, fallback for others
        if (event === 'push') {
            const commits = payload.commits.map(c => `[\`${c.id.substring(0, 7)}\`](${c.url}) ${c.message}`).join('\n');
            embed.setDescription(`**Pushed to ${payload.ref.split('/').pop()}**\n${commits || 'No commit message'}`);
        } 
        else if (event === 'issues') {
            embed.setDescription(`**Issue ${payload.action}:** [#${payload.issue.number} ${payload.issue.title}](${payload.issue.html_url})`);
        } 
        else if (event === 'pull_request') {
            embed.setDescription(`**Pull Request ${payload.action}:** [#${payload.pull_request.number} ${payload.pull_request.title}](${payload.pull_request.html_url})`);
        } 
        else {
            // Catch-all for stars, forks, wiki edits, etc.
            const actionText = payload.action ? `Action: **${payload.action}**` : 'An update occurred in the repository.';
            embed.setDescription(actionText);
        }

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending GitHub update to Discord:', error);
        }
    });

    app.listen(port, () => {
        console.log(`📡 GitHub Webhook server listening on port ${port}`);
    });
};