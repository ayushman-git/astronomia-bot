const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { messageId } = require("./commands/apod");

require("dotenv").config();
const PREFIX = ".";

const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});
client.commands = new Collection();
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", (msg) => {
  if (msg.content === '!join') {
		client.emit('guildMemberAdd', msg.member);
	}
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const [CMD_NAME, ...args] = msg.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

  const command =
    client.commands.get(CMD_NAME) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(CMD_NAME)
    );

  if (!command) return;
  try {
    command.execute(msg, args);
  } catch (err) {
    console.log(err);
    msg.reply("There was an error.");
  }
});

client.on('guildMemberAdd', (msg) => {
  console.log(msg)
})

client.on("messageReactionAdd", (reaction, user) => {
  // console.log(reaction);
  // console.log(user);
})

client.login(process.env.DISCORD_BOT_TOKEN);
