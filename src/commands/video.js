const name = "video";

const getRandomVid = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

module.exports = {
  name,
  aliases: ["vid"],
  description: "Suggest videos",
  async execute(message, args, client, db) {
    let msgID = null;
    let msgInstance = null;
    const apodRef = db.collection("fetchObjects").doc("videoURL");
    const doc = await apodRef.get();
    const videoURLs = doc.data().videoArr;

    message.channel.send(getRandomVid(videoURLs)).then(async (msg) => {
      msgID = msg.id;
      msgInstance = msg;
      await msg.react("🔀")
    });
    client.on("messageReactionAdd", async (reaction, user) => {
      if (user.bot) {
        return;
      }
      if (msgID === reaction.message.id) {
        if (reaction._emoji.name === "🔀") {
          msgInstance.edit(getRandomVid(videoURLs));
        }
      }
    });
  },
};
