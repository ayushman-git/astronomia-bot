const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const movies = require("../assets/astronomyMovies");

module.exports = {
  data: new SlashCommandBuilder().setName("movie").setDescription("Suggest a random space movie"),
  cooldown: 3,
  async execute(interaction) {
    const m = movies[Math.floor(Math.random() * movies.length)];
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setTitle(m.title)
      .setURL(m.link)
      .setImage(m.poster)
      .setDescription(m.description)
      .addFields({ name: `Rating`, value: `${m.rating}`, inline: true })
      .setTimestamp(new Date())
      .setFooter({ text: "Astronomia" });
    await interaction.reply({ embeds: [embed] });
  },
};

