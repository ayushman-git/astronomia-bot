require("dotenv").config();
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { db } = require("./db/firebase");
const setupAutos = require("./util/setupAutos");
const registerReady = require("./events/ready");
const registerInteractionCreate = require("./events/interactionCreate");
const registerGuildCreate = require("./events/guildCreate");
const registerChannelCreate = require("./events/channelCreate");
const loadSlashCommands = require("./util/slashLoader");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

// Collections for commands and cooldowns
client.commands = new Collection();
client.cooldowns = new Collection();

// Load autos and slash commands
setupAutos(client);
loadSlashCommands(client);

// Register events
registerReady(client, db);
registerInteractionCreate(client, db);
registerGuildCreate(client);
registerChannelCreate(client);

// Schedule autos
setInterval(() => {
  const changeActivity = client.autos.get("changeActivity");
  if (changeActivity) changeActivity.execute(client);
}, 300000);

setInterval(() => {
  ["getHubbleNews", "spaceX", "fetchVideos", "apod"].forEach((k) => {
    const auto = client.autos.get(k);
    if (auto) auto.execute(client, db);
  });
}, 3600000);

setInterval(() => {
  const auto = client.autos.get("fetchData");
  if (auto) auto.execute(db);
}, 3600000 * 1.2);

setInterval(() => {
  const auto = client.autos.get("spaceFlightNews");
  if (auto) auto.execute(client, db);
}, 3600000 * 4);
client.login(process.env.DISCORD_BOT_TOKEN);
