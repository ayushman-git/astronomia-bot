const { checkTextChannels } = require("../util/helper"); 

const clientReadySetup = (client, db) => {
  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.autos.get("changeActivity").execute(client);
    console.log(`Astronomia is in ${client.guilds.cache.size} servers.`);
    client.autos.get("fetchVideos").execute(client, db);
    checkTextChannels(client, db);
    // Test user
    // client.users.fetch("USERID").then((data) => console.log(data));
  });
}

module.exports = clientReadySetup;