const { Events, SectionBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const express = require('express');
const app = express();

async function getUserPresence(client, userId) {
	for (const guild of client.guilds.cache.values()) {
		const member = await guild.members.fetch(userId).catch(() => null);
		if (member?.presence) {
			return {
				guildId: guild.id,
				status: member.presence.status,
				activities: member.presence.activities.map(activity => ({
					name: activity.name,
					type: activity.type,
					details: activity.details,
					state: activity.state,
					url: activity.url,
				})),
			};
		}
	}
	return null;
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const exampleSection = new SectionBuilder()
			.addTextDisplayComponents(
				(textDisplay) =>
					textDisplay.setContent(
						'This text is inside a Text Display component! You can use **any __markdown__** available inside this component too.',
					),
				(textDisplay) => textDisplay.setContent('Using a section, you may only use up to three Text Display components.'),
				(textDisplay) => textDisplay.setContent('And you can place one button or one thumbnail component next to it!'),
			)
			.setButtonAccessory((button) =>
				button.setCustomId('exampleButton').setLabel('Button inside a Section').setStyle(ButtonStyle.Primary),
			);

			const channel= await client.channels.fetch('1467487109668540416')
		await channel.send({
			components: [exampleSection],
			flags: MessageFlags.IsComponentsV2,
		});
		app.get('/', async (req, res) => {
			const userId = req.params.id;
			try {
				const user = await client.users.fetch("925203396397522955");
				const presence = await getUserPresence(client, user);
				res.json({
					id: user.id,
					username: user.username,
					discriminator: user.discriminator,
					avatarURL: user.avatarURL(),
					createdAt: user.createdAt,
					bot: user.bot,
					activities: presence ? presence.activities : [],
					guildId: presence ? presence.guildId : null,
					status: presence ? presence.status : 'offline',
				});
				
			} catch (error) {
				res.status(404).json({ error: 'Pas trouvé ;w;' });
			}
		});
		app.listen(process.env.PORT || 1337, () => {
			console.log('API sur http://localhost:' + (process.env.PORT || 1337));
		});

		console.log(`✅🤖 Loggé tant que ${client.user.tag}.`);
		client.user.setPresence({ activities: [{ type: 4, name: '*rires*' }], status: 'idle' });
	},
};

