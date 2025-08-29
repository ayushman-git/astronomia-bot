const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const btoa = require("btoa");

const astronomyKey = () => btoa(`${process.env.ASTRONOMY_APPLICATION_ID}:${process.env.ASTRONOMY_SECRET}`);

async function fetchLatLong(address) {
  const res = await axios.get(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_KEY}&q=${encodeURIComponent(address)}&format=json`
  );
  return {
    lat: res.data[0]?.lat,
    long: res.data[0]?.lon,
    place: res.data[0]?.display_name?.split(",")[0],
  };
}

async function fetchMoon(address) {
  const { data } = await axios.post(
    "https://api.astronomyapi.com/api/v2/studio/moon-phase",
    {
      format: "png",
      style: {
        moonStyle: "default",
        backgroundStyle: "solid",
        backgroundColor: "black",
        headingColor: "black",
        textColor: "white",
      },
      observer: {
        latitude: Number(address?.lat),
        longitude: Number(address?.long),
        date: new Date(),
      },
      view: { type: "portrait-simple" },
    },
    { headers: { "X-Requested-With": "XMLHttpRequest", Authorization: `Basic ${astronomyKey()}` } }
  );
  return data.data.imageUrl;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moonphase")
    .setDescription("Show the current moon phase for a location")
    .addStringOption((opt) => opt.setName("location").setDescription("City or place").setRequired(true)),
  cooldown: 6,
  async execute(interaction) {
    const location = interaction.options.getString("location");
    await interaction.deferReply();
    try {
      const info = await fetchLatLong(location);
      if (!info?.lat) return interaction.editReply("Invalid location.");
      const url = await fetchMoon(info);
      const embed = new EmbedBuilder()
        .setColor("#F0386B")
        .setTitle("Moon Phase")
        .addFields(
          { name: `📍 ${info.place}`, value: "\u200b" },
          { name: "Lat", value: `${Number(info.lat).toFixed(4)}`, inline: true },
          { name: "Long", value: `${Number(info.long).toFixed(4)}`, inline: true }
        )
        .setImage(url)
        .setTimestamp(new Date())
        .setFooter({ text: "Astronomia • astronomyapi.com" });
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply("Something went wrong while fetching data.");
    }
  },
};

