module.exports = {
    help: { name: "help" },
    run: async (call) => {
        var message = call.message
            , Mess_Member = call.message.member
            , Discord = require("discord.js")
        //message, bot, bot.commands, args, content, prefix, cmd

        try {
            if (!call.bot.member_Has_MANAGE_GUILD) {
                return message.reply("Vous n'êtes pas autorisé à faire cette commande.").then(msg => {
                    call.bot.deleteMyMessage(msg, call.bot.ms("15s"))
                })
            } else {
                //console.log(message.member)
                var embed_help = new Discord.RichEmbed()
                    .setAuthor(`Il semblerait que tu aurais besoin d'aide ?`, call.bot.user.avatarURL)
                    .setColor("GREEN")
                    .setDescription(`*Liste de toutes les commandes du bot ${call.bot.user.username}*`)
                    .addField(`${call.bot.config.prefix}add_users_role`, `Permet de donner un rôle à plusieurs personnes en même temps.\n**Exemple: ${call.bot.config.prefix}add_users_role ID @User @User**`, true)
                    .addBlankField()
                    .addField(`${call.bot.config.prefix}remove_users_role`, `Permet **d'enlever un rôle à tout le monde qui ont ce rôle** :warning:\n**Exemple: ${call.bot.config.prefix}remove_users_role ID**`, true)

                    .setFooter(`Commande d'aide demandée par ${message.member.user.tag}`)
                    .setTimestamp()
                message.channel.send(embed_help)
            }


        } catch (error) {
            console.log(`Error on the ${File.name}`)
            console.log(error)
        }

    }
}