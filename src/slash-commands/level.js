const { SlashCommandBuilder } = require("@discordjs/builders");
const { AttachmentBuilder } = require("discord.js");
const Canvas = require("canvas");
const path = require("path");
const levelData = require("../assets/levelData");

const getUserExp = async (userID, db) => {
  const ref = db.collection("fetchObjects").doc("userXp");
  const doc = await ref.get();
  return doc.data()?.[userID] || 0;
};

const calcUserLevel = (userXP) => levelData.find((level) => level.forNextLevel > userXP);

async function createUserCanvas(user, userLvl, userXP) {
  const canvas = Canvas.createCanvas(600, 400);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // user name
  ctx.font = "bold 30px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(user.username, 204, 200);

  // level + rank
  ctx.font = "18px Arial";
  ctx.fillStyle = userLvl.color;
  ctx.textAlign = "center";
  ctx.fillText(`Level ${userLvl.level}` + " | " + userLvl.title, 204, 230);

  // level img
  const lvlImg = await Canvas.loadImage(path.join(__dirname, "..", `assets/images/level/${userLvl.level}.png`));
  ctx.drawImage(lvlImg, canvas.width / 2 + 20, -((lvlImg.height - canvas.height) / 2), lvlImg.width, lvlImg.height);
  ctx.save();

  // avatar
  ctx.beginPath();
  ctx.arc(160 + 45, 70 + 45, 45, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(user.displayAvatarURL({ extension: "jpg", size: 256 }));
  ctx.drawImage(avatar, 160, 70, 90, 90);
  ctx.restore();

  let x = 75, r = 20, y = 280, w = 260, h = 40;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.clip();

  // XP bar
  ctx.fillStyle = "#212121";
  ctx.fillRect(75, 280, 260, 40);

  // XP fill
  ctx.fillStyle = userLvl.color;
  ctx.fillRect(
    75,
    280,
    (((userXP - userLvl.forPreviousLevel) / (userLvl.forNextLevel - userLvl.forPreviousLevel)) * 260),
    40
  );

  // XP text
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`${userXP - userLvl.forPreviousLevel}/${userLvl.forNextLevel - userLvl.forPreviousLevel} XP`, 204, 306);

  return new AttachmentBuilder(canvas.toBuffer("image/png"), { name: "user-xp.png" });
}

async function deleteProgress(userID, db) {
  const xpRef = db.collection("fetchObjects").doc("userXp");
  await xpRef.update({ [userID]: 0 });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Show a user's level profile or reset your progress")
    .addUserOption((opt) => opt.setName("user").setDescription("User to view"))
    .addBooleanOption((opt) => opt.setName("reset").setDescription("Reset your own progress")),
  cooldown: 6,
  async execute(interaction, client, db) {
    const reset = interaction.options.getBoolean("reset");
    const targetUser = interaction.options.getUser("user") || interaction.user;
    if (reset) {
      if (targetUser.id !== interaction.user.id) {
        return interaction.reply({ content: "You can only reset your own progress.", ephemeral: true });
      }
      await deleteProgress(interaction.user.id, db);
      return interaction.reply({ content: "Your progress has been reset.", ephemeral: true });
    }

    await interaction.deferReply();
    const userXP = await getUserExp(targetUser.id, db);
    const userLvl = calcUserLevel(userXP);
    const card = await createUserCanvas(targetUser, userLvl, userXP);
    await interaction.editReply({ files: [card], content: `\u200b\n${userLvl.description}` });
  },
};

