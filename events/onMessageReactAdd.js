const { Events, EmbedBuilder } = require('discord.js');
const moment = require('moment')

module.exports = {
    name: Events.MessageReactionAdd,
    once: false,
    async execute(msgReact, User) {

        if (!msgReact.message.author.bot) {
            console.log(`➕🥺 ${User.username} → ${msgReact.message.channel.name}: "${msgReact.emoji.name}"  sur "${msgReact.message.content}". (${msgReact.count} fois.)[${moment().format(('MMMM Do YYYY, h:mm:ss a'))}]`);
            const targetChannel = await msgReact.client.channels.fetch(process.env.REACT_ADD);
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle('➕🥺 à ajouté.e une réaction')
                .setAuthor({ name: `${User.displayName} (${User.username})`, iconURL: User.avatarURL(), url: 'https://discord.com/users/' + User.id })
                .setDescription(msgReact.emoji.name + ' à été ajouté par <@' + User.id + '> (`' + User.username + '`) sur le message de <@' + msgReact.message.author.id + '> (`' + msgReact.message.author.username + '`) disant:\n' + msgReact.message.content)
                .addFields(
                    { name: 'Réagi', value: msgReact.count + ' fois.', inline: true },
                    { name: 'Animé?', value: msgReact.emoji.animated ? "Oui." : "Non.", inline: true },
                    { name: 'Ajouté dans', value: '<#' + msgReact.message.channelId + '> (' + msgReact.message.channel.name + ')', inline: true },
                    { name: 'ID du message', value: `[${msgReact.message.id}](${msgReact.message.url})`, inline: true }
                )
                .setTimestamp()
            await targetChannel.send({
                embeds: [embed]
            });
        } else {
            console.log(`❗🤖 ${msgReact.message.author.username} est un bot, inutile de log.`)
        }
    },
};