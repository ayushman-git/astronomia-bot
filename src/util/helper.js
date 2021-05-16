module.exports = {
  checkTextChannels(client, db) {
    if (process.env.DEV) return;
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
  },
  hoursToMs(hrs) {
    return hrs * 3600000;
  }
};
