const Canvas = require("canvas");
const path = require("path");
const { MessageAttachment } = require("discord.js");

const getUserExp = async (userID, db) => {
  const ref = db.collection("fetchObjects").doc("userXp");
  const doc = await ref.get();
  return (XP = doc.data()[userID] || 0);
};

const calcUserLevel = (userXP) => {
  let userLvl = 0;
  let xpCounter = 100;
  while (xpCounter <= userXP) {
    userLvl++;
    xpCounter = xpCounter + xpCounter * 1.1;
  }
  const forNextLevel = xpCounter - userXP;
  return {
    level: userLvl,
    nextXP: Math.round(forNextLevel),
    nextLevel: Math.round(xpCounter),
  };
};

const createUserCanvas = async (user, userLvl) => {
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
  ctx.fillStyle = "#666666";
  ctx.textAlign = "center";
  ctx.fillText(`Level ${userLvl.level}` + " | " + "Planet", 204, 224);

  //XP bar
  ctx.fillStyle = "#212121";
  ctx.fillRect(75, 280, 260, 40);

  //XP fill
  ctx.fillStyle = "#3C4DDE";
  ctx.fillRect(
    75,
    280,
    Math.floor(
      (((userLvl.nextLevel - userLvl.nextXP) / userLvl.nextLevel) * 100 * 260) /
        100
    ),
    40
  );

  //XP font
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(
    `${userLvl.nextLevel - userLvl.nextXP}/${userLvl.nextLevel} XP`,
    204,
    306
  );

  //level img
  const lvlImg = await Canvas.loadImage(
    path.join(__dirname, "..", "assets/images/explore/earth.png")
  );
  ctx.drawImage(
    lvlImg,
    canvas.width / 2 + 20,
    -((lvlImg.height - canvas.height) / 2),
    lvlImg.width,
    lvlImg.height
  );

  //user avatar
  ctx.beginPath();
  ctx.arc(160 + 45, 70 + 45, 45, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ format: "jpg", size: 256 })
  );
  ctx.drawImage(avatar, 160, 70, 90, 90);

  const attachment = new MessageAttachment(canvas.toBuffer(), "user-xp.png");
  return attachment;
};

const name = "level";
module.exports = {
  name,
  aliases: ["l", "lvl"],
  description: "Display user EXP card.",
  async execute(message, args, client, db) {
    if (args.length === 0) {
      const userXP = await getUserExp(message.author.id, db);
      const userLvl = calcUserLevel(userXP);
      message.channel.send(await createUserCanvas(message.author, userLvl));
    }
  },
};
