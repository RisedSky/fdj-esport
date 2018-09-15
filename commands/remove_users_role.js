module.exports = {
    help: { name: "remove_users_role" },
    run: async (call) => {
        var message = call.message
            , Mess_Member = call.message.member
            , Discord = require("discord.js")
        //message, bot, bot.commands, args, content, prefix, cmd


        try {
            if (!call.bot.member_Has_MANAGE_GUILD) return message.reply("Vous n'êtes pas autorisé à faire cette commande.").then(msg => {
                call.bot.deleteMyMessage(msg, call.bot.ms("15s"))
            })

            if (!call.args[0]) {
                return message.reply("Désolé mais tu n'as pas ajouté l'ID du rôle en question.").then(msg => {
                    call.bot.deleteMyMessage(msg, call.bot.ms("10s"))
                })
            } else {
                var role = message.guild.roles.find("id", call.args[0])
                if (role.hasPermission("ADMINISTRATOR") || role.hasPermission("MANAGE_GUILD")) {
                    return message.reply("Désolé, tu n'as pas le droit de faire sur ce role, il est protégé !").then(msg => {
                        call.bot.deleteMyMessage(msg, call.bot.ms("10s"))
                    })
                }
                message.channel.send(`Removing the role ${role.name} for everyone\nRemoved to: ? users\nRequested by <@${message.member.id}>`).then(msg => {
                    var numberRoleDeleted = 0;
                    for (var i in message.guild.members.array()) {
                        if (message.guild.members.array()[i].roles.find("id", call.args[0])) {
                            message.guild.members.array()[i].removeRole(call.args[0]).then(() => {
                                numberRoleDeleted++;
                                msg.edit((`Removing the role ${role.name} for everyone\nRemoved to: ? users\nRequested by <@${message.member.id}>`).replace("?", numberRoleDeleted))
                            })
                        }
                    }
                    numberRoleDeleted = 0
                    //msg.delete(call.bot.ms("5s"))
                })
            }

        } catch (error) {
            console.log(`Error on the ${File.name}`)
            console.log(error)
        }
    }
}
