const { Events, SectionBuilder, ButtonStyle, MessageFlags } = require('discord.js');

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


		console.log(`✅🤖 Loggé tant que ${client.user.tag}.`);
		client.user.setPresence({ activities: [{ type: 4, name: '*rires*' }], status: 'idle' })
	},
};

