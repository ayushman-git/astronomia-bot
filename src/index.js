const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

require("dotenv").config();
const PREFIX = ".";

const client = new Client();
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
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const [CMD_NAME, ...args] = msg.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

  if (!client.commands.has(CMD_NAME)) return;
  try {
    client.commands.get(CMD_NAME).execute(msg, args);
  } catch(err) {
    console.log(err);
    msg.reply("There was an error.");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
