const axios = require("axios");
const { MessageEmbed } = require("discord.js");
let currentApod = null;
let previousApod = null;

module.exports = {
  name: "apod",
  description: "Get daily apod",
  execute(client) {
    axios
      .get(
        "https://api.nasa.gov/planetary/apod?api_key=" +
          process.env.NASA_APID_KEY
      )
      .then((res) => {
        currentApod = res.data;
        client.guilds.cache.forEach((server) => {
          const channel = server.channels.cache.find(
            (channel) => channel.name === "astronomia"
          );
          if (channel) {
            if (JSON.stringify(currentApod) != JSON.stringify(previousApod)) {
              const publicationDate = new Date(currentApod.date);
              const apodEmbed = new MessageEmbed()
                .setColor("#F0386B")
                .setTitle(currentApod.title)
                .setURL(currentApod.url)
                .setImage(currentApod.url)
                .setDescription(
                  currentApod.explanation.split(" ").splice(0, 30).join(" ") +
                    "..."
                )
                .setFooter(
                  `${publicationDate.getDate()}/${
                    publicationDate.getMonth() + 1
                  }/${publicationDate.getFullYear()}`
                );
              channel.send(apodEmbed).then(async (msg) => {
                await msg.react("🛰");
              });
            }
          }
        });
        previousApod = currentApod;
      });
  },
};
