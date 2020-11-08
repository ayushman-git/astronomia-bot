const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "apod",
  description: "Get daily apod",
  execute(client, db) {
    axios
      .get(
        "https://api.nasa.gov/planetary/apod?api_key=" +
          process.env.NASA_APID_KEY
      )
      .then(async (res) => {
        if (res.status >= 400) {
          return;
        }
        //get previous apod
        const apodRef = db.collection("fetchObjects").doc("apod");
        const doc = await apodRef.get();
        const previousApod = doc.data().todayApod;
        const currentApod = res.data;
        client.guilds.cache.forEach((server) => {
          const channel = server.channels.cache.find(
            (channel) => channel.name === "astronomia"
          );
          if (channel) {
            if (JSON.stringify(currentApod) != previousApod) {
              const publicationDate = new Date(currentApod.date);
              const apodEmbed = new MessageEmbed()
                .setColor("#F0386B")
                .setTitle(currentApod.title)
                .setURL(currentApod.url)
                .setImage(currentApod.url)
                .setDescription(currentApod.explanation)
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
        //change previous apod with current
        await apodRef.set({
          todayApod: JSON.stringify(currentApod),
        });
      })
      .catch((err) => {
        console.log("Error in recieving apod. (Maybe APOD not uploaded yet)");
      });
  },
};
