const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

const canvas = Canvas.createCanvas(600, 200);
const ctx = canvas.getContext("2d");
const createImage = async (user) => {
  //background
  const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grd.addColorStop(0, "#200122");
  grd.addColorStop(1, "#6f0000");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //username
  ctx.font = "48px sans";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    `${user.username}`,
    220,
    canvas.height / 2 - 24
  );

  //avatar
  ctx.beginPath();
  ctx.arc(100, 100, 75, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
  const avatar = await Canvas.loadImage(
    user.displayAvatarURL({ format: "jpeg" })
  );
  ctx.drawImage(avatar, 25, 25, canvas.height - 50, canvas.height - 50);

  const attachment = new MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  );
  return attachment;
};
module.exports = {
  name: "stats",
  aliases: ["s"],
  description: "Check user stats",
  execute(message, args) {
    (async () => {
      const img = await createImage(message.author);
      await message.channel.send(img);
    })();
  },
};
