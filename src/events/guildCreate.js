const { EmbedBuilder } = require("discord.js");

const guildCreateMessage = (client) => {
  client.on("guildCreate", (guild) => {
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setDescription(
        "Thank you for adding Astronomia! Use slash commands (e.g., /help). Create a text channel named 'astronomia' to get the latest astronomy news."
      )
      .setThumbnail(guild.iconURL({ size: 128 }))
      .setFooter({ text: "Astronomia was added" })
      .setTimestamp(guild.joinedAt);
    try {
      const systemId = guild.systemChannelId;
      const channel = systemId
        ? guild.channels.cache.get(systemId)
        : guild.channels.cache.find((c) => c.isTextBased?.());
      if (channel && channel.isTextBased()) {
        channel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = guildCreateMessage;
