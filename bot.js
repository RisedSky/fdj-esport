//import { default as config } from "./config.js";
const Discord = require("discord.js")
const bot = new Discord.Client({ autoReconnect: true })
bot.moment = require("moment")
bot.config = require("./config.js").config;
const fs = require("fs")
	, ms = require("ms")
bot.ms = require("ms")
//#region Dev
var DefaultGuildID = bot.config.DefaultGuildID;

var BOT_TOKEN = bot.config.BOT_TOKEN;
bot.login(BOT_TOKEN);

let prefix = bot.config.prefix;
let bot_version = bot.config.bot_version;
//#endregion

bot.prefixLog = "[!] "
bot.servers = {};

bot.commands = new Discord.Collection();
bot.disabledCommands = [];
var jsfiles;

function checkCommand(command, name) {
	var resultOfCheck = [true, null];
	if (!command.run) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Function: "module.run" of ${name}.`;
	if (!command.help) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Object: "module.help" of ${name}.`;
	if (command.help && !command.help.name) resultOfCheck[0] = false; resultOfCheck[1] = `Missing String: "module.help.name" of ${name}.`;
	return resultOfCheck;
}

fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	jsfiles = files.filter(f => f.endsWith(".js"));
	if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
	jsfiles.forEach((f) => {
		try {
			var props = require(`./commands/${f}`);
			if (checkCommand(props, f)[0]) {
				bot.commands.set(props.help.name, props);
			} else {
				throw checkCommand(props, f)[1];
			}
		} catch (err) {
			bot.disabledCommands.push(f);
			console.log(`\nThe ${f} command failed to load:`);
			console.log(err);
		}
	});
});

class Call {
	constructor(message, bot, commands, args, content, prefix, cmd) {
		this.message = message;
		this.bot = bot;
		this.commands = commands;
		this.args = args;
		this.content = content;
		this.prefix = prefix;
		this.cmd = cmd;
	}
}

bot.on('ready', () => { //When bot is ready
	bot.user.setStatus("online")
	console.log("------------------------------")
	console.log(`${bot.prefixLog} Bot created by KLIM RisedSky#4814`)
	console.log(`${bot.prefixLog} All rights reserved`)
	console.log(`${bot.prefixLog} The bot is now ready`)
	console.log("------------------------------")

	bot.user.setActivity(prefix + "help | Started and ready !");
	setTimeout(ChangeState1, 20000);
	console.log("The bot is now ready !")
	console.log(`I am connected as '${bot.user.tag}'`)

	for (var i in bot.guilds.array()) {
		console.log(`${i} » '${bot.guilds.array()[i]}' with ${bot.guilds.array()[i].members.size} members`)
	}

})

bot.on("guildCreate", guild => {
	console.log(`Joined a new server: '${guild.name}' - '${guild.id}' by ${guild.owner} (${guild.ownerID})`)
})

bot.on('message', async message => { //Quand une personne envoi un message

	try {

		if (message.author.bot) return;
		if (!message.guild) {
			return bot.users.find("id", "516033691525447680").send(`Message reçu de <@${message.author.id}> (${message.author.tag} - ${message.author.id})\nContenu: \`\`\`${message.content}\`\`\` `)
		}

		const prefix = bot.config.prefix,
			cmd = message.content.slice(bot.config.prefix.length).trim().split(/ +/g).shift(),
			args = message.content.slice(bot.config.prefix.length).trim().split(/ +/g).join(" ").slice(cmd.length + 1).split(" "),
			//cmd = message.content.slice(bot.config.prefix.length).trim().split(/ +/g),
			content = args.join(" ");

		if (!message.content.startsWith(prefix) || message.content.startsWith(prefix + prefix)) return;

		//#region Permission Du Bot
		bot.BOT_SEND_MESSAGESPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("SEND_MESSAGES") && message.channel.type === 'text'
		bot.BOT_MANAGE_MESSAGESPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("MANAGE_MESSAGES") && message.channel.type === 'text'
		bot.BOT_ADMINISTRATORPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("ADMINISTRATOR") && message.channel.type === 'text'
		bot.BOT_USE_EXTERNAL_EMOJISPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") && message.channel.type === 'text'
		bot.BOT_ADD_REACTIONSPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("ADD_REACTIONS") && message.channel.type === 'text'
		//#endregion


		//#region Permission de la personne
		bot.member_Has_BAN_MEMBERS = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("BAN_MEMBERS") && message.channel.type === 'text'
		bot.member_Has_MANAGE_GUILD = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("MANAGE_GUILD") && message.channel.type === 'text'
		bot.member_has_MANAGE_MESSAGES = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("MANAGE_MESSAGES") && message.channel.type === 'text'

		//#endregion

		//Auto-Delete Function

		bot.DeleteUserMessage = function (deleteit = true) {
			clearInterval(deleteUserMsg);
			if (!deleteit) return;
			if (message.deletable) {
				message.delete(1500).catch(e => {
					if (e.name === "DiscordAPIError") return;
					console.log("can't delete this message: " + e)
				});
			}
		}
		var deleteUserMsg = setInterval(bot.DeleteUserMessage, 1200);


		if (message.content.startsWith(prefix) && !message.author.bot) {
			setTimeout(() => {
				const commandFile = bot.commands.find((command) => (command.help.aliases || []).concat([command.help.name]).includes(cmd));
				if (commandFile != null) {
					if (message.channel.type !== "dm" || (commandFile.help.dm || false)) {
						commandFile.run(new Call(message, bot, bot.commands, args, content, prefix, cmd));
					} else message.reply("This command isn't working in DM")
				} else {
					try {
						bot.DeleteUserMessage(false)
						//message.react(bot.EmojiThonkong)

						try {
							message.react("❓").catch(e => {
								if (e.name === "DiscordAPIError") return;
								console.log("Error default > " + e);
							})
							setTimeout(() => {
								message.reactions.forEach(reaction => {
									reaction.remove(bot.user)
									//remove(bot.user).then(t => {
									//console.log("deleted " + t);

								})

								/*message.clearReactions().catch(e => {
									if (e.name === "DiscordAPIError") return;
									console.log("Error default > " + e);
								})*/
							}, 5000);
						} catch (error) {
							console.log("I can't add any reaction in this message: " + message.content + "\n" + error)
						}
					} catch (error) {

					}
				}
			}, 500);
		}
	} catch (error) {
		console.log("Error sur le message")
		console.log(error)
	}

})

bot.on('error', err => {
	console.log(err)
})

//#region Functions

//#region Important functions
bot.deleteMyMessage = function (message, time) {
	try {
		if (time === null) {
			time = 750;
		}

		if (!message.author.name === bot.user.name || !message.author.name === bot.user.username) {
			return;
		}
		message.delete(time).catch(error => (console.log("deleteMyMessage prblm : " + error)));
	} catch (error) {
		console.log("Problem on deleteMyMessage function: " + error)
	}
}

bot.sendDMToUser = function (message, msgToSend) {
	message.author.createDM().catch(e => {
		if (e.name === "DiscordAPIError") {
			message.reply("Sorry but i can't DM you, open your DM please.")
			return;
		}
	})

	message.author.send(msgToSend)
		.then(msg => {
			bot.deleteMyMessage(msg, 600 * 1000)
		})
		.catch(e => {
			if (e.name === "DiscordAPIError") {
				message.reply("Sorry but i can't DM you, open your DM please.")
				return;
			}
		})
}

let ChangeBotState = true;
function ChangeState1() {
	if (!ChangeBotState) return;
	bot.user.setActivity(prefix + "help | By KLIM RisedSky#4814");
	setTimeout(ChangeState2, ms("5m"));
}

function ChangeState2() {
	if (!ChangeBotState) return;
	bot.user.setActivity(prefix + "help | Besoin d'un bot ? MP » KLIM RisedSky#4814");
	setTimeout(ChangeState1, ms("5m"));
}

bot.DeleteTheMessage = function (message, time) {
	//#region Permission Du Bot
	const BOT_SEND_MESSAGESPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("SEND_MESSAGES") && message.channel.type === 'text'
	const BOT_MANAGE_MESSAGESPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("MANAGE_MESSAGES") && message.channel.type === 'text'
	const BOT_ADMINISTRATORPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("ADMINISTRATOR") && message.channel.type === 'text'
	const BOT_USE_EXTERNAL_EMOJISPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("USE_EXTERNAL_EMOJIS") && message.channel.type === 'text'
	const BOT_ADD_REACTIONSPerm = message.guild.channels.find("id", message.channel.id).permissionsFor(message.guild.me).has("ADD_REACTIONS") && message.channel.type === 'text'
	//#endregion

	//#region Permission de la personne
	const member_Has_BAN_MEMBERS = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("BAN_MEMBERS") && message.channel.type === 'text'
	const member_Has_MANAGE_GUILD = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("MANAGE_GUILD") && message.channel.type === 'text'
	const member_has_MANAGE_MESSAGES = message.guild.channels.find("id", message.channel.id).permissionsFor(message.member).has("MANAGE_MESSAGES") && message.channel.type === 'text'
	//#endregion

	try {
		if (time == null || time == undefined) {
			time = 750;
		}

		if (message.deletable && !message.pinned) {
			message.delete(time)
			//console.log(`Deleted ${message.content}`);
		} else console.log(`Not permitted`);

	} catch (error) {
		console.log(error);

	}
}

bot.NotifyUser = function (ID) {
	return `<@${ID}>`
}

bot.ReplaceThing = function (text, ThingToReplace, ReplaceTo) {
	let new_text = String(text)
	let new_ThingToReplace = String(ThingToReplace)
	let new_ReplaceTo = String(ReplaceTo)

	if (new_text.includes(new_ThingToReplace)) {
		//var re = /`${new_ThingToReplace}`/gi
		var re = new RegExp(new_ThingToReplace, "gi")

		var result = new_text.replace(re, new_ReplaceTo)
		//console.log(result);

		return result;
	} else return new_text;
}

bot.PermissionCheck = function (PermToCheck) {
	if (PermToCheck === true) {
		return PermissionYes;
	} else {
		return PermissionNo;
	}
}
//#endregion

//#endregion

module.exports = bot, Call;