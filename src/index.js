const { Client } = require("discord.js");
require("dotenv").config();

const { db } = require("./db/firebase");
const messageHandler = require("./events/message");
const clientReadySetup = require("./events/clientReady");
const guildCreateMessage = require("./events/guildCreate");
const channelCreateMessage = require("./events/channelCreate");
const setupAutos = require("./util/setupAutos");
const setupCommands = require("./util/setupCommands");

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

(function setup() {
  setupAutos(client);
  setupCommands(client);
})();

clientReadySetup(client, db);
messageHandler(client, db);
channelCreateMessage(client);
guildCreateMessage(client);

setInterval(() => {
  client.autos.get("changeActivity").execute(client);
}, 300000);

setInterval(() => {
  client.autos.get("getHubbleNews").execute(client, db);
  client.autos.get("spaceX").execute(client, db);
  client.autos.get("fetchVideos").execute(client, db);
  client.autos.get("apod").execute(client, db);
}, 3600000);
setInterval(() => {
  client.autos.get("fetchData").execute(db);
}, 3600000 * 1.2);
setInterval(() => {
  client.autos.get("spaceFlightNews").execute(client, db);
}, 3600000 * 4);

client.login(process.env.DISCORD_BOT_TOKEN);
