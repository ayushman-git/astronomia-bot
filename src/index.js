const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
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

const PREFIX = ".";
//Test
// const PREFIX = "test.";
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

//Check text channels
const checkTextChannels = function () {
  let textChannels = 0;
  client.guilds.cache.forEach((server) => {
    const channel = server.channels.cache.find(
      (channel) => channel.name === "astronomia"
    );
    if (channel) {
      textChannels++;
    }
  });
  const ref = db.collection("fetchObjects").doc("commandUsage");
  ref.set(
    {
      textChannels,
    },
    { merge: true }
  );
};

//Bot is online
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.autos.get("changeActivity").execute(client);
  console.log(`Astronomia is in ${client.guilds.cache.size} servers.`);
  checkTextChannels();
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
    command.execute(msg, args, client, db);
  } catch (err) {
    console.log(err);
    msg.reply("There was an error.");
  }
});
setInterval(() => {
  client.autos.get("changeActivity").execute(client);
}, 300000);

setInterval(() => {
  client.autos.get("getHubbleNews").execute(client, db);
  client.autos.get("spaceX").execute(client, db);
}, 3600000);
setInterval(() => {
  client.autos.get("apod").execute(client, db);
}, 3600000 * 1.5);
setInterval(() => {
  client.autos.get("fetchData").execute();
}, 3600000 / 2);

client.login(process.env.DISCORD_BOT_TOKEN);
