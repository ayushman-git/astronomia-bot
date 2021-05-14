const axios = require("axios");
const { MessageEmbed } = require("discord.js");

const fetchNews = async () => {
  const res = await axios.get("https://spaceflightnewsapi.net/api/v2/articles?_limit=1");
  return res.data;
};

const fetchPreviousNewsId = async (apiIDsRef) => {
  const doc = await apiIDsRef.get();
  return doc.data().spaceFlightNews;
};

const createEmbed = (news) => {
  const embed =  new MessageEmbed()
  .setColor("#1ABC9C")
  .setTitle(news.title)
  .setURL(news.url)
  .setDescription(news.summary)
  .setImage(news.imageUrl)
  .setFooter(news.newsSite)
  .setTimestamp();
  return embed;
}

const checkAstronomiaChannel = (server) => {
  return server.channels.cache.find((channel) => {
    return channel.name === "astronomia";
    // for testing
    // return channel.id === "788648838813450260";
  });
};

module.exports = {
  name: "spaceFlightNews",
  description:
    "Get latest news from https://www.spaceflightnewsapi.net/documentation",
  async execute(client, db) {
    const apiIDsRef = db.collection("fetchObjects").doc("API_IDs");
    const promise = await Promise.all([fetchNews(), fetchPreviousNewsId(apiIDsRef)]);
    const news = promise[0];
    const previousNewsId = promise[1];
    console.log(news[0]);
    if (news[0].id !== previousNewsId) {
      client.guilds.cache.forEach((server) => {
        const channel = checkAstronomiaChannel(server);
        if(channel) {
          channel.send(createEmbed(news[0]));
        }
      });
      await apiIDsRef.set({
        spaceFlightNews: news[0].id,
      });
    }
  },
};
