const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.ThreadDelete,
    once: false,
    async execute(thread) {
        const owner = await thread.fetchOwner()
        console.log(`➖🧵 ${thread.name}`);
        const targetChannel = await thread.client.channels.fetch(process.env.THREAD_RM);
        console.log(thread.client)
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle('➖🧵 à supprimé.e un thread')
            //.setAuthor({ name: `${thread.author.displayName} (${thread.author.username})`, iconURL: thread.author.avatarURL(), url: `https://discord.com/users/${thread.author.id}` })
            .setDescription(`${thread.name} ([${thread.id}](${thread.url})) à été créé <t:${Math.floor(thread.createdTimestamp / 1000)}:R> par <@${thread.ownerId}> (${owner.user.username}), il ${thread.parent? "n'as pas de parent" : `as un parent, il se nomme <#${thread.parentId}> (${thread.parent.name}, [${thread.parentId}](${thread.parent.url}))`} et son type est ${thread.type}.`)
            .addFields(
                { name: 'Créé', value: `<t:${Math.floor(thread.createdTimestamp / 1000)}:R> par <@${thread.ownerId}>`, inline: true },
                { name: 'Parent?', value: thread.parent? `<#${thread.parentId}> (${thread.parent.name}, [${thread.parentId}](${thread.parent.url}))`:`Non.`, inline: true },
                { name: 'Owner', value: `<@${thread.ownerId}> (${owner.user.username})`, inline: true },
                { name: 'ID', value: `[${thread.id}](${thread.url})`, inline: true }
            )
            .setTimestamp()
        await targetChannel.send({
            embeds: [embed]
        });
    },
};