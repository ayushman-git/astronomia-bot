const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const factsData = require("../assets/factsData");

module.exports = {
  data: new SlashCommandBuilder().setName("facts").setDescription("Show a random fact about space"),
  cooldown: 3,
  async execute(interaction) {
    const fact = factsData[Math.floor(Math.random() * factsData.length)];
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setTitle(fact.title)
      .setDescription(fact.description)
      .setTimestamp(new Date())
      .setFooter({ text: "Astronomia" });
    await interaction.reply({ embeds: [embed] });
  },
};

