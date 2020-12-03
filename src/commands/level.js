const Canvas = require("canvas");
const path = require("path");
const { MessageAttachment } = require("discord.js");

const getUserExp = async (userID, db) => {
  const ref = db.collection("fetchObjects").doc("userXp");
  const doc = await ref.get();
  return (XP = doc.data()[userID] || 0);
};
const createUserCanvas = async (client, userXP) => {
  const canvas = Canvas.createCanvas(600, 400);
  const ctx = canvas.getContext("2d");
  const background = await Canvas.loadImage(
    path.join(__dirname, "..", "assets/images/bg.jpg")
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  const attachment = new MessageAttachment(canvas.toBuffer(), "user-xp.png");
  return attachment;
};

const name = "level";
module.exports = {
  name,
  // aliases: ["l", "lvl"],
  description: "Display user EXP.",
  async execute(message, args, client, db) {
    userXP = await getUserExp(message.author.id, db);

    message.channel.send(await createUserCanvas(client));
  },
};
