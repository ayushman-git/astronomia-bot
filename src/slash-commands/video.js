const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function controlsRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("cmd:video:shuffle").setStyle(ButtonStyle.Secondary).setLabel("Shuffle")
  );
}

module.exports = {
  data: new SlashCommandBuilder().setName("video").setDescription("Suggest a random space video"),
  cooldown: 3,
  async execute(interaction, client, db) {
    await interaction.deferReply();
    const ref = db.collection("fetchObjects").doc("videoURL");
    const doc = await ref.get();
    const urls = doc.data()?.videoArr || [];
    if (!urls.length) return interaction.editReply("No videos available.");
    await interaction.editReply({ content: rand(urls), components: [controlsRow()] });
  },
  async handleButton(interaction, client, db) {
    if (interaction.customId !== "cmd:video:shuffle") return;
    const ref = db.collection("fetchObjects").doc("videoURL");
    const doc = await ref.get();
    const urls = doc.data()?.videoArr || [];
    if (!urls.length) return interaction.update({ content: "No videos available.", components: [] });
    await interaction.update({ content: rand(urls), components: [controlsRow()] });
  },
};

