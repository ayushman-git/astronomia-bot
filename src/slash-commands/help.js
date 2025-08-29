const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available Astronomia commands"),
  cooldown: 3,
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setTitle("Astronomia Commands")
      .setDescription("Use these slash commands to explore the cosmos ✨")
      .addFields(
        { name: "News", value: "Create a #astronomia channel to receive updates" },
        { name: "Astronomy Picture", value: "/apod — NASA's APOD" },
        { name: "Sky View", value: "/sky location:<place> style:<navy|red|white|black>" },
        { name: "Upcoming", value: "/upcoming [type: flights|events]" },
        { name: "Wallpapers", value: "/wallpaper [type: real|random]" },
        { name: "Quotes", value: "/quotes" },
        { name: "Profile", value: "/level, /rank" }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
