const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const images = require("../assets/images");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("explore")
    .setDescription("Explore a celestial object in our solar system")
    .addStringOption((opt) => opt.setName("object").setDescription("Name of the object (e.g., mars)").setRequired(true)),
  cooldown: 6,
  async execute(interaction) {
    const obj = interaction.options.getString("object").toLowerCase();
    await interaction.deferReply();
    try {
      const { data } = await axios.get(`https://api.le-systeme-solaire.net/rest/bodies/${obj}`);
      const embed = new EmbedBuilder()
        .setColor("#F0386B")
        .setTitle(data.name === data.englishName ? data.englishName : `${data.englishName} (${data.name})`)
        .addFields(
          { name: "Density", value: `${Number(data.density).toFixed(2)} g/cm^3`, inline: true },
          { name: "Gravity", value: `${data.gravity} m/s^2`, inline: true },
          { name: "Moons", value: `${data.moons ? Object.keys(data.moons).length : 0}` , inline: true },
          { name: "Mass", value: `${Number(data.mass.massValue).toFixed(2)}^${data.mass.massExponent} kg`, inline: true },
          { name: "Escape Velocity", value: `${(data.escape/1000).toFixed(1)} km/s`, inline: true },
          { name: "Orbital Revolution", value: `${Number(data.sideralOrbit).toFixed(2)} days`, inline: true },
          { name: "Rotation", value: `${(data.sideralRotation/24).toFixed(2)} days`, inline: true },
          { name: "Radius", value: `${Number(data.meanRadius).toFixed(2)} km`, inline: true }
        )
        .setTimestamp(new Date())
        .setFooter({ text: "Astronomia • Solar System OpenData" });
      if (images[obj]) {
        embed.setDescription(images[obj].description).setImage(images[obj].link);
      }
      if (data.discoveredBy) embed.addFields({ name: "Discovered By", value: `${data.discoveredBy}`, inline: true });
      if (data.discoveryDate) embed.addFields({ name: "Discovered On", value: `${data.discoveryDate}`, inline: true });
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      if (err?.response?.status === 404) {
        await interaction.editReply("Object not found. API only covers solar system objects.");
      } else {
        console.error(err);
        await interaction.editReply("Something went wrong.");
      }
    }
  },
};

