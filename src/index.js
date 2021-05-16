const { Client } = require("discord.js");
require("dotenv").config();
const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "astronomia-c2f5d",
    private_key_id: process.env.FIRESTORE_PRIVATE_KEY_ID,
    private_key: process.env.FIRESTORE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIRESTORE_CLIENT_EMAIL,
    client_id: "104413135440882877790",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CERT,
  }),
});

const db = new admin.firestore();
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
