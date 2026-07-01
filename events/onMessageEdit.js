const { Events, EmbedBuilder } = require('discord.js');
const moment = require('moment')

module.exports = {
    name: Events.MessageUpdate,
    once: false,
    async execute(oldMsg, newMsg) {
        if (oldMsg.content.length, newMsg.content.length = 0) {
            console.log(`❗💬 Le nouveau ou ancien message de ${msg.author.username} est vide, inutile de log.`)
        } else if (!oldMsg.author.bot) {
            console.log(`➖💬 ${oldMsg.author.username} → ${oldMsg.channel.name}: "${oldMsg.content}" 🔁 "${newMsg.content}" [${moment().format(('MMMM Do YYYY, h:mm:ss a'))}]`);
            const targetChannel = await oldMsg.client.channels.fetch(process.env.MSG_UPDT);
            const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle('🔁💬 à mis à jour un message')
                .setAuthor({ name: `${oldMsg.author.displayName} (${oldMsg.author.username})`, iconURL: oldMsg.author.avatarURL(), url: 'https://discord.com/users/' + oldMsg.author.id })
                .setDescription('**Original**\n' + oldMsg.toString() + '\n**Édité**\n' + newMsg.toString())

                .addFields(
                    { name: 'Créé', value: ' <t:' + Math.floor(oldMsg.createdAt / 1000) + ':R>.', inline: true },
                    { name: 'ID', value: oldMsg.id, inline: true },
                    { name: 'Envoyé dans', value: '<#' + oldMsg.channelId + '> (' + oldMsg.channel.name + ')', inline: true },
                )
                .setTimestamp()
            await targetChannel.send({
                embeds: [embed]
            })
        } else {
            console.log(`❗🤖 ${oldMsg.author.username} est un bot, inutile de log.`)
        }
    },
};