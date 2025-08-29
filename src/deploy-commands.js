#!/usr/bin/env node
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const isGuild = process.argv.includes("--guild");
const isGlobal = process.argv.includes("--global");
if (!isGuild && !isGlobal) {
  console.error("Specify --guild for dev or --global for prod registration.");
  process.exit(1);
}

const commandsPath = path.join(__dirname, "slash-commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
const commands = [];
for (const file of commandFiles) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const command = require(path.join(commandsPath, file));
  if (command?.data) commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

async function run() {
  try {
    console.log(`Registering ${commands.length} command(s)...`);
    if (isGuild) {
      const route = Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID);
      await rest.put(route, { body: commands });
      console.log("Guild commands registered.");
    }
    if (isGlobal) {
      const route = Routes.applicationCommands(process.env.DISCORD_CLIENT_ID);
      await rest.put(route, { body: commands });
      console.log("Global commands registered.");
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();

