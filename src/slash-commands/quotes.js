const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const quotesData = require("../assets/quotesData");

module.exports = {
  data: new SlashCommandBuilder().setName("quotes").setDescription("Show a random space-related quote"),
  cooldown: 3,
  async execute(interaction) {
    const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setTitle("Quote")
      .setDescription(randomQuote.content)
      .addFields({ name: "\u200b", value: `— ${randomQuote.author}` })
      .setTimestamp(new Date());
    await interaction.reply({ embeds: [embed] });
  },
};

