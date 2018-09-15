module.exports = {
    help: { name: "add_users_role" },
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
            } else if (!call.args[1]) {
                return message.reply("Désolé mais tu n'as pas mentionné la personne en question.").then(msg => {
                    call.bot.deleteMyMessage(msg, call.bot.ms("10s"))
                })
            } else {
                var role = message.guild.roles.find("id", call.args[0])
                if (role.hasPermission("ADMINISTRATOR") || role.hasPermission("MANAGE_GUILD")) {
                    return message.reply("Désolé, tu n'as pas le droit de faire sur ce role, il est protégé !").then(msg => {
                        call.bot.deleteMyMessage(msg, call.bot.ms("10s"))
                    })
                }
                var users = message.mentions.members.array()
                let users_msg = "";

                for (var i in users) {
                    //console.log(users[i]);
                    users_msg += `<@${users[i].id}> `
                }
                message.channel.send(`Added the role ${role.name} for ${users_msg}\nAdded to: ? users\nRequested by <@${message.member.id}>`).then(msg => {
                    var numberRoleAdded = 0;
                    for (var i in users) {
                        if (!users[i].roles.find("id", call.args[0])) {
                            users[i].addRole(role).then(() => {
                                numberRoleAdded++;
                                msg.edit((`Added the role ${role.name} for ${users_msg}\nAdded to: ? users\nRequested by <@${message.member.id}>`).replace("?", numberRoleAdded))
                            })
                        }
                    }
                })
            }

        } catch (error) {
            console.log(`Error on the ${File.name}`)
            console.log(error)
        }
    }
}
