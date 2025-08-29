const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const btoa = require("btoa");

const astronomyKey = () =>
  btoa(`${process.env.ASTRONOMY_APPLICATION_ID}:${process.env.ASTRONOMY_SECRET}`);

async function fetchLatLong(address) {
  const res = await axios.get(
    `https://eu1.locationiq.com/v1/search.php?key=${process.env.LOCATION_IQ_KEY}&q=${encodeURIComponent(
      address
    )}&format=json`
  );
  return {
    lat: res.data[0]?.lat,
    long: res.data[0]?.lon,
    place: res.data[0]?.display_name?.split(",")[0],
  };
}

async function fetchSky(latLong, style) {
  const { data } = await axios.post(
    "https://api.astronomyapi.com/api/v2/studio/star-chart",
    {
      style: style || "navy",
      observer: {
        latitude: Number(latLong?.lat),
        longitude: Number(latLong?.long),
        date: new Date(),
      },
      view: {
        type: "area",
        parameters: {
          position: {
            equatorial: { rightAscension: 0, declination: Number(latLong?.lat) },
          },
          zoom: 4,
        },
      },
    },
    {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Basic ${astronomyKey()}`,
      },
    }
  );
  return data.data.imageUrl;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sky")
    .setDescription("Generate a sky view for a location")
    .addStringOption((opt) =>
      opt.setName("location").setDescription("City, address, or place").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("style")
        .setDescription("Map style")
        .addChoices(
          { name: "navy", value: "navy" },
          { name: "red", value: "red" },
          { name: "white (inverted)", value: "inverted" },
          { name: "black (default)", value: "default" }
        )
    ),
  cooldown: 6,
  async execute(interaction) {
    const location = interaction.options.getString("location");
    const style = interaction.options.getString("style") || "navy";
    await interaction.deferReply();
    try {
      const addressDetail = await fetchLatLong(location);
      if (!addressDetail?.lat || !addressDetail?.long) {
        await interaction.editReply("Location is not given or invalid.");
        return;
      }
      const mapURL = await fetchSky(addressDetail, style);
      const embed = new EmbedBuilder()
        .setColor("#F0386B")
        .setTitle("Sky view")
        .setImage(mapURL)
        .addFields(
          { name: `📍 ${addressDetail.place}`, value: "\u200b" },
          { name: `Lat`, value: `${Number(addressDetail.lat).toFixed(4)}`, inline: true },
          { name: `Long`, value: `${Number(addressDetail.long).toFixed(4)}`, inline: true }
        )
        .setTimestamp(new Date())
        .setFooter({ text: "Astronomia • astronomyapi.com" });
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      await interaction.editReply("Something went wrong. Can't generate map.");
    }
  },
};

