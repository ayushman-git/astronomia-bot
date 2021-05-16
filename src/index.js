const { Client } = require("discord.js");
require("dotenv").config();

const { db } = require("./db/firebase");
const messageHandler = require("./events/message");
const clientReadySetup = require("./events/clientReady");
const guildCreateMessage = require("./events/guildCreate");
const channelCreateMessage = require("./events/channelCreate");
const setupAutos = require("./util/setupAutos");
const setupCommands = require("./util/setupCommands");
const setupIntervals = require("./util/setupIntervals");

const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

(function setup() {
  setupAutos(client);
  setupCommands(client);
})();

(function setupEvents() {
  clientReadySetup(client, db);
  messageHandler(client, db);
  channelCreateMessage(client);
  guildCreateMessage(client);
})();

(function setupIntervalsTimeouts() {
  setupIntervals(client);
})();

client.login(process.env.DISCORD_BOT_TOKEN);
