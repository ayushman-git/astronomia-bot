const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const showEmbed = (currentApod) => {
  if (currentApod.media_type === "video") {
    return apodData.url;
  }
  const publicationDate = new Date(currentApod.date);
  const apodEmbed = new MessageEmbed()
    .setColor("#F0386B")
    .setTitle(currentApod.title)
    .setURL(currentApod.url)
    .setDescription(`\`\`\` ${currentApod.explanation}\`\`\``)
    .setImage(currentApod.url)
    .setFooter(
      `${publicationDate.getDate()}/${
        publicationDate.getMonth() + 1
      }/${publicationDate.getFullYear()}`
    );
  return apodEmbed;
};

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
          const channel = server.channels.cache.find((channel) => {
            return channel.name === "astronomia";
            // for testing
            // return channel.id === "Channel Id";
          });
          if (channel) {
            if (currentApod.date != previousApod) {
              channel.send(showEmbed(currentApod));
            }
          }
        });
        //change previous apod with current
        await apodRef.set({
          todayApod: currentApod.date,
        });
      })
      .catch(() => {
        console.log("Error in recieving apod. (Maybe APOD not uploaded yet)");
      });
  },
};
