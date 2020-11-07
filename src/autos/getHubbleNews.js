const axios = require("axios");
const { MessageEmbed } = require("discord.js");

let currentNews = null;
let previousNews = null;
module.exports = {
  name: "getHubbleNews",
  description:
    "Get latest news from https://hubblesite.org/api/v3/news_release/last",
  execute(client) {
    (function fetchNews() {
      axios
        .get("https://hubblesite.org/api/v3/news_release/last")
        .then((res) => {
          if (res.status >= 400) {
            return;
          }
          currentNews = res.data;
          client.guilds.cache.forEach((server) => {
            const channel = server.channels.cache.find(
              (channel) => channel.name === "astronomia"
            );
            if (channel) {
              if (JSON.stringify(currentNews) != JSON.stringify(previousNews)) {
                const newsDate = new Date(currentNews.publication);
                const publicationDate = `${newsDate.getDate()}/${
                  newsDate.getMonth() + 1
                }/${newsDate.getFullYear()}`;
                const newsEmbed = new MessageEmbed()
                  .setColor("#F0386B")
                  .setTitle(currentNews.name)
                  .setURL(currentNews.url)
                  .setImage(`https:${currentNews.thumbnail_2x}`)
                  .setDescription(
                    currentNews.abstract.split(" ").splice(0, 50).join(" ") +
                      "..."
                  )
                  .setTimestamp(publicationDate);
                channel.send(newsEmbed);
              }
            }
          });
          previousNews = currentNews;
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  },
};
