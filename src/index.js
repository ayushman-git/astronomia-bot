const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const PREFIX = ".";
const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.commands = new Collection();
client.autos = new Collection();

//array of auto scripts
const autoScripts = fs
  .readdirSync(path.join(__dirname, "autos"))
  .filter((file) => file.endsWith(".js"));

//array of commands
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"));

//Creating collection of commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Creating collection of scripts
for (const file of autoScripts) {
  const auto = require(`./autos/${file}`);
  client.autos.set(auto.name, auto);
}

//Bot is online
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.autos.get("changeActivity").execute(client);
});

client.on("message", (msg) => {
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
setInterval(() => {
  client.autos.get("changeActivity").execute(client);
}, 300000);

setInterval(() => {
  client.autos.get("getHubbleNews").execute(client);
}, 3600000);
setInterval(() => {
  client.autos.get("apod").execute(client);
}, 3600000 * 1.5);

client.login(process.env.DISCORD_BOT_TOKEN);
