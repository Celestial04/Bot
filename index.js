import { Client, Collection, GatewayIntentBits } from "discord.js";
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	],
});
const express = require('express');
const app = express();

// Commands collections
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Events handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Web Server
app.use(express.static("public"));

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

app.get('/api', async (req, res) => {
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
app.listen(process.env.PORT || 80, () => {
	console.log('API sur http://localhost:' + (process.env.PORT || 1337));
});

client.login(process.env.DISCORD_TOKEN);