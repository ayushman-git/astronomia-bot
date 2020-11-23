let totalMembers = 0;

module.exports = {
  name: "thisistotestservers",
  description: "Check server stats",
  execute(message, args, client) {
    client.guilds.cache.array().forEach((server) => {
      totalMembers += server.memberCount;
      console.log(
        `Server name - ${server.name} | Region - ${server.region} | Members - ${server.memberCount}`
      );
      console.log("Total members - " + totalMembers);
    });
    message.channel.send(
      `Servers - ${client.guilds.cache.size} | Members - ${totalMembers}`
    );
  },
};
