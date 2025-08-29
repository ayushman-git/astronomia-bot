const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const astronauts = require("../assets/astronautsData");

function listPage(page, pageSize = 20) {
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, astronauts.length);
  const names = astronauts.slice(start, end).map((a, i) => `${start + i + 1} - ${a.name}`);
  return names.join("\n");
}

function listEmbed(page) {
  return new EmbedBuilder()
    .setColor("#F0386B")
    .setTitle("Astronauts' List")
    .setDescription(`There are approximately ${astronauts.length} astronauts.`)
    .addFields({ name: "\u200b", value: "```glsl\n" + listPage(page) + "\n```" });
}

function navRow(page) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`cmd:astronaut:list:prev:${page}`).setStyle(ButtonStyle.Secondary).setLabel("Prev"),
    new ButtonBuilder().setCustomId(`cmd:astronaut:list:next:${page}`).setStyle(ButtonStyle.Secondary).setLabel("Next")
  );
}

function detailEmbed(item) {
  const e = new EmbedBuilder()
    .setColor("#F0386B")
    .setTitle(item.name)
    .setDescription(item.bio || "\u200b")
    .setThumbnail(item.profile_image_thumbnail || null)
    .setImage(item.profile_image || null)
    .addFields(
      { name: "Status", value: item.status?.name || "-", inline: true },
      { name: "Type", value: item.type?.name || "-", inline: true },
      { name: "Nationality", value: item.nationality || "-", inline: true }
    )
    .setTimestamp(new Date());
  if (item.wiki) e.setURL(item.wiki);
  return e;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("astronaut")
    .setDescription("Browse astronauts or view details")
    .addSubcommand((sc) => sc.setName("list").setDescription("List astronauts").addIntegerOption((opt) => opt.setName("page").setDescription("Page number")))
    .addSubcommand((sc) => sc.setName("get").setDescription("Get astronaut details").addStringOption((opt) => opt.setName("name").setDescription("Name contains").setRequired(true))),
  cooldown: 6,
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    if (sub === "get") {
      const q = interaction.options.getString("name").toLowerCase();
      const found = astronauts.find((a) => a.name.toLowerCase().includes(q));
      if (!found) return interaction.reply({ content: "Astronaut not found.", ephemeral: true });
      return interaction.reply({ embeds: [detailEmbed(found)] });
    }
    // list
    const page = Math.max(1, interaction.options.getInteger("page") || 1);
    await interaction.reply({ embeds: [listEmbed(page)], components: [navRow(page)] });
  },
  async handleButton(interaction) {
    if (!interaction.customId.startsWith("cmd:astronaut:list:")) return;
    const parts = interaction.customId.split(":");
    const action = parts[3];
    const page = Math.max(1, parseInt(parts[4], 10) || 1);
    const newPage = action === "next" ? page + 1 : Math.max(1, page - 1);
    await interaction.update({ embeds: [listEmbed(newPage)], components: [navRow(newPage)] });
  },
};

