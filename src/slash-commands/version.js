const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder().setName("version").setDescription("Show bot version"),
  cooldown: 3,
  async execute(interaction) {
    // Read from package.json without caching project root wrong path
    // Using require with relative path to repo root may suffice here
    // since this file is in src/slash-commands.
    // eslint-disable-next-line global-require
    const pkg = require(path.join(__dirname, "..", "..", "package.json"));
    await interaction.reply({ content: pkg.version || "unknown" });
  },
};

