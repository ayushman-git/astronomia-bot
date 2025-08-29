const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const wallpaperUrl = require("../assets/wallpaperUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wallpaper")
    .setDescription("Get a space-themed wallpaper")
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Choose 'real' from Pexels or 'random' curated")
        .addChoices(
          { name: "real", value: "real" },
          { name: "random", value: "random" }
        )
    ),
  cooldown: 6,
  async execute(interaction) {
    const type = interaction.options.getString("type") || "random";
    await interaction.deferReply();
    try {
      if (type === "real") {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const randomImage = Math.floor(Math.random() * 14);
        const res = await axios.get(
          `https://api.pexels.com/v1/search/?page=${randomPage}&per_page=15&query=space`,
          { headers: { Authorization: process.env.PEXEL_API_KEY } }
        );
        const photo = res.data.photos[randomImage];
        const embed = new EmbedBuilder()
          .setColor("#F0386B")
          .setTitle("Download from Pexels")
          .setImage(photo.src.large)
          .setURL(photo.url)
          .setTimestamp(new Date())
          .setFooter({ text: "Astronomia • Pexels API" });
        await interaction.editReply({ embeds: [embed] });
      } else {
        const randomImageUrl = wallpaperUrl[Math.floor(Math.random() * wallpaperUrl.length)];
        const embed = new EmbedBuilder()
          .setColor("#F0386B")
          .setImage(randomImageUrl)
          .setTimestamp(new Date())
          .setFooter({ text: "Astronomia" });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
      await interaction.editReply("Failed to fetch wallpaper.");
    }
  },
};

