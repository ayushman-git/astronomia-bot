const { checkTextChannels } = require("../util/helper");

module.exports = function registerReady(client, db) {
  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    const changeActivity = client.autos.get("changeActivity");
    if (changeActivity) changeActivity.execute(client);
    console.log(`Astronomia is in ${client.guilds.cache.size} servers.`);
    const fetchVideos = client.autos.get("fetchVideos");
    if (fetchVideos) fetchVideos.execute(client, db);
    checkTextChannels(client, db);
  });
};

