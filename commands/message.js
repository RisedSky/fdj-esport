module.exports = {
    help: { name: "message" },
    run: async (call) => {
        var message = call.message
            , Mess_Member = call.message.member
            , Discord = require("discord.js")
        //message, bot, bot.commands, args, content, prefix, cmd

        try {
            if (message.author.id == "516033691525447680" || message.author.id == "142646071192059904") {
                if (!call.args[0]) {
                    return message.reply("Tu as oublié de mettre l'ID de la personne.").then(m => call.bot.deleteMyMessage(m, "5000"))
                }
                if (!call.args[1]) {
                    return message.reply("Tu as oublié de mettre le message.").then(m => call.bot.deleteMyMessage(m, "5000"))
                }

                call.bot.fetchUser(call.args[0]).catch(() => {
                    message.reply("Sorry, can't find this user ! :thinking:").then(msg => {
                        call.bot.deleteMyMessage(msg, 8 * 1000)
                    })
                }).then(user => {
                    var message_to_send = call.content.slice(call.args[0].length + 1)
                    //console.log(message_to_send);
                    user.createDM().then(() => {
                        user.send(message_to_send)
                            .then(() => {
                                message.channel.send(`${message.author.tag} Sended the message to ${user.tag} - ${call.bot.NotifyUser(user.id)} \n\`\`\`${message_to_send}\`\`\` `)
                            })
                            .catch(() => {
                                message.reply("Sorry but i can't DM him.").then(msg => {
                                    call.bot.deleteMyMessage(msg, 8 * 1000)
                                });
                            });

                    })

                });
            }
        } catch (error) {
            console.log(`Error on the ${File.name}`)
            console.log(error)
        }
    }
}