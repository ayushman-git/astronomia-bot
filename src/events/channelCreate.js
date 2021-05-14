const { MessageEmbed } = require("discord.js");

const createChannelEmbed = (channel) => {
  const embed = new MessageEmbed()
    .setColor("#F0386B")
    .setTitle("Astronomia News Channel")
    .setDescription(
      `\`\`\`css\nThis channel will now send updates on SpaceX launches, daily APOD and other astronomical news. 📡 \`\`\``
    )
    .setThumbnail(channel.guild.iconURL({ size: 128 }))
    .setFooter("This channel was created on ")
    .setTimestamp(channel.guild.createdAt);
  return embed;
};

const channelCreateMessage = (client) => {
  client.on("channelCreate", (channel) => {
    if ((channel.type === "text" && channel.name === "astronomia")) {
      try {
        channel.send(createChannelEmbed(channel));
      } catch (err) {
        console.log(err);
      }
    }
  });
};

module.exports = channelCreateMessage;
