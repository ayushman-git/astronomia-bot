const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "getHubbleNews",
  description:
    "Get latest news from https://hubblesite.org/api/v3/news_release/last",
  execute(client, db) {
    (function fetchNews() {
      axios
        .get("https://hubblesite.org/api/v3/news_release/last")
        .then(async (res) => {
          if (res.status >= 400) {
            return;
          }
          //get previous news
          const hubbleRef = db.collection("fetchObjects").doc("hubble");
          const doc = await hubbleRef.get();
          const previousNews = doc.data().news;
          const currentNews = res.data;

          client.guilds.cache.forEach((server) => {
            const channel = server.channels.cache.find(
              (channel) => channel.name === "astronomia"
            );
            if (channel) {
              if (JSON.stringify(currentNews) != previousNews) {
                const newsDate = new Date(currentNews.publication);
                const publicationDate = `${newsDate.getDate()}/${
                  newsDate.getMonth() + 1
                }/${newsDate.getFullYear()}`;
                const newsEmbed = new MessageEmbed()
                  .setColor("#F0386B")
                  .setTitle(currentNews.name)
                  .setURL(currentNews.url)
                  .setImage(`https:${currentNews.thumbnail_2x}`)
                  .setDescription("```" + currentNews.abstract + "```")
                  .addField("\u200B", `[Full Story](${currentNews.url})`)
                  .setTimestamp(publicationDate);
                channel.send(newsEmbed);
              }
            }
          });
          //change previous news with current
          await hubbleRef.set({
            news: JSON.stringify(currentNews),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  },
};
