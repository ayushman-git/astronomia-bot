const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

const setupAutos = (client) => {
  client.autos = new Collection();
  const autoScripts = fs
    .readdirSync(path.join(__dirname, "..", "autos"))
    .filter((file) => file.endsWith(".js"));

  for (const file of autoScripts) {
    const auto = require(`../autos/${file}`);
    client.autos.set(auto.name, auto);
  }
};

module.exports = setupAutos;
