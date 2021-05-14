const { MessageEmbed } = require("discord.js");

const guildCreateMessage = (client) => {
  client.on("guildCreate", (guild) => {
    const embed = new MessageEmbed()
      .setColor("#F0386B")
      .setDescription(
        "Thank you for adding astronomia to your server. You can use **.h** or **.help** to get list of all commands. You can also create a text channel named **astronomia** to get latest astronomy news."
      )
      .setThumbnail(guild.iconURL({ size: 128 }))
      .setFooter("Astronomia was added ")
      .setTimestamp(guild.joinedAt);
    try {
      let channelID;
      let channels = guild.channels.cache;
      channelLoop: for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "text") {
          channelID = c[0];
          break channelLoop;
        }
      }
      let channel = guild.channels.cache.get(guild.systemChannelID || channelID);
      channel.send(embed);
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = guildCreateMessage;