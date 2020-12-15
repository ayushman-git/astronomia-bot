const Canvas = require("canvas");
const path = require("path");
const { MessageAttachment } = require("discord.js");
const commandUsage = require("../support/commandUsage");

const levelData = require("../assets/levelData");

const getUserExp = async (userID, db) => {
  const ref = db.collection("fetchObjects").doc("userXp");
  const doc = await ref.get();
  return (XP = doc.data()[userID] || 0);
};

const calcUserLevel = (userXP) => {
  const lvlObj = levelData.find((level) => level.forNextLevel > userXP);
  return lvlObj;
};

const createUserCanvas = async (user, userLvl, userXP) => {
  const canvas = Canvas.createCanvas(600, 400);
  const ctx = canvas.getContext("2d");

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //user name
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(user.username, 204, 200);

  //level + rank
  ctx.font = "18px Arial";
  ctx.fillStyle = userLvl.color;
  ctx.textAlign = "center";
  ctx.fillText(`Level ${userLvl.level}` + " | " + userLvl.title, 204, 230);

  //level img
  const lvlImg = await Canvas.loadImage(
    path.join(__dirname, "..", `assets/images/level/${userLvl.level}.png`)
  );
  ctx.drawImage(
    lvlImg,
    canvas.width / 2 + 20,
    -((lvlImg.height - canvas.height) / 2),
    lvlImg.width,
    lvlImg.height
  );
  ctx.save();
  //user avatar
  ctx.beginPath();
  ctx.arc(160 + 45, 70 + 45, 45, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ format: "jpg", size: 256 })
  );
  ctx.drawImage(avatar, 160, 70, 90, 90);
  ctx.restore();
  let x = 75,
    r = 20,
    y = 280,
    w = 260,
    h = 40;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  //XP bar
  ctx.fillStyle = "#212121";
  ctx.fillRect(75, 280, 260, 40);

  //XP fill
  ctx.fillStyle = userLvl.color;
  ctx.fillRect(
    75,
    280,
    (((userXP - userLvl.forPreviousLevel) /
      (userLvl.forNextLevel - userLvl.forPreviousLevel)) *
      100 *
      260) /
      100,
    40
  );

  //XP font
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    `${userXP - userLvl.forPreviousLevel}/${
      userLvl.forNextLevel - userLvl.forPreviousLevel
    } XP`,
    204,
    306
  );

  const attachment = new MessageAttachment(canvas.toBuffer(), "user-xp.png");
  return attachment;
};

const name = "level";
module.exports = {
  name,
  aliases: ["l", "lvl", "profile"],
  description: "Display user EXP card.",
  async execute(message, args, client, db) {
    commandUsage(name, db);
    if (args.length === 0) {
      const userXP = await getUserExp(message.author.id, db);
      const userLvl = calcUserLevel(userXP);
      message.channel
        .send(await createUserCanvas(message.author, userLvl, userXP))
        .then((msg) => msg.channel.send("```" + userLvl.description + "```"));
    }
  },
};
