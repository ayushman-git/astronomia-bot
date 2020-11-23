module.exports = {
  name: "thisistotestservers",
  description: "Check server stats",
  execute(message, args, client) {
    message.channel.send(client.guilds.cache.size);
    client.guilds.cache.array().forEach((server) => {
      console.log(
        `Server name - ${server.name} | Region - ${server.region} | Members - ${server.memberCount}`
      );
    });
  },
};
