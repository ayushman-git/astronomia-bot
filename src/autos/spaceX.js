const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "spaceX",
  description:
    "Get latest news from https://api.spacexdata.com/v4/launches/latest",
  execute(client, db) {
    (function fetchNews() {
      axios
        .get("https://api.spacexdata.com/v4/launches/latest")
        .then(async (res) => {
          if (res.status >= 400) {
            return;
          }
          //get previous news
          const spaceXref = db.collection("fetchObjects").doc("spaceX");
          const doc = await spaceXref.get();
          const previousNews = doc.data().news;
          const currentNews = res.data;

          client.guilds.cache.forEach((server) => {
            const channel = server.channels.cache.find((channel) => {
              return channel.name === "astronomia";
              // for testing
              // return channel.id === "770180128340312065";
            });
            if (channel) {
              if (currentNews.id != previousNews) {
                const newsDate = new Date(currentNews.date_local);
                const publicationDate = `${newsDate.getDate()}/${
                  newsDate.getMonth() + 1
                }/${newsDate.getFullYear()}`;
                const newsEmbed = new MessageEmbed()
                  .setColor("#F0386B")
                  .setTitle(currentNews.name)
                  .setDescription(
                    currentNews.details +
                      ` [Full Story](${currentNews.links.article})`
                  )
                  .setTimestamp(publicationDate)
                  .setFooter("Generated by astronomia using SpaceX API");
                if (currentNews.links.article) {
                  newsEmbed.setURL(currentNews.links.article);
                }
                if (currentNews.links.flickr.original) {
                  newsEmbed.setImage(
                    currentNews.links.flickr.original[
                      Math.floor(
                        Math.random() * currentNews.links.flickr.original.length
                      )
                    ]
                  );
                }
                if (currentNews.links.patch.small) {
                  newsEmbed.setThumbnail(currentNews.links.patch.small);
                }
                if (currentNews.links.webcast) {
                  newsEmbed.addField(
                    "\u200b",
                    `[Video Coverage](${currentNews.links.webcast})`,
                    true
                  );
                }
                if (currentNews.links.wikipedia) {
                  newsEmbed.addField(
                    "\u200b",
                    `[Wikipedia](${currentNews.links.wikipedia})`,
                    true
                  );
                }
                if (currentNews.links.reddit.launch) {
                  newsEmbed.addField(
                    "\u200b",
                    `[Reddit](${currentNews.links.reddit.launch})`,
                    true
                  );
                }
                channel.send(newsEmbed);
              }
            }
          });
          //change previous news with current
          await spaceXref.set({
            news: currentNews.id,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })();
  },
};
