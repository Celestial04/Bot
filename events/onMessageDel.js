const { Events, EmbedBuilder } = require('discord.js');
const moment = require('moment')

module.exports = {
    name: Events.MessageDelete,
    once: false,
    async execute(msg) {
        if (msg.content.length = 0) {
            console.log(`❗💬 Le message de ${msg.author.username} est vide, inutile de log.`)
        } else if (!msg.author.bot) {
            console.log(`➖💬 ${msg.author.username} → ${msg.channel.name}: ${msg.content} [${moment().format(('MMMM Do YYYY, h:mm:ss a'))}]`);
            const targetChannel = await msg.client.channels.fetch(process.env.MSG_RM);
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle('➖💬 à supprimé.e un message')
                .setAuthor({ name: `${msg.author.displayName} (${msg.author.username})`, iconURL: msg.author.avatarURL(), url: 'https://discord.com/users/' + msg.author.id })
                .setDescription(msg.content)
                .addFields(
                    { name: 'Créé', value: ' <t:' + Math.floor(msg.createdTimestamp / 1000) + ':R>.', inline: true },
                    { name: 'Était un poll:', value: msg.poll ? "Oui." : "Non.", inline: true },
                    { name: 'Avait un thread:', value: msg.hasThread ? "Oui." : "Non.", inline: true },
                    { name: 'ID', value: `[${msg.id}](${msg.url})`, inline: true },
                    { name: 'Supprimé dans', value: '<#' + msg.channelId + '> (' + msg.channel.name + ')', inline: true },
                )
                .setTimestamp()
            await targetChannel.send({
                embeds: [embed]
            });
        } else {
            console.log(`❗🤖 ${msg.author.username} est un bot, inutile de log.`)
        }
    }
};