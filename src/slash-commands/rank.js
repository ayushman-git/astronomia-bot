const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("rank").setDescription("Show top explorers"),
  cooldown: 6,
  async execute(interaction, client, db) {
    await interaction.deferReply();
    const statsRef = db.collection("fetchObjects").doc("userXp");
    const doc = await statsRef.get();
    const stats = Object.entries(doc.data() || {});
    const sorted = stats.sort((a, b) => b[1] - a[1]).slice(0, 5);
    const usernames = await Promise.all(
      sorted.map(async ([id]) => {
        try {
          const u = await client.users.fetch(id);
          return u.username;
        } catch {
          return id;
        }
      })
    );
    const lines = usernames.map((name, i) => `${i + 1} - ${name}`);
    const embed = new EmbedBuilder()
      .setColor("#F0386B")
      .setTitle("Top Explorers")
      .setDescription(lines.map((l) => `\`${l}\``).join("\n"));
    await interaction.editReply({ embeds: [embed] });
  },
};

