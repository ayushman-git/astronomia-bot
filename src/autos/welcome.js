const Canvas = require("canvas");
const { MessageAttachment } = require("discord.js");

const canvas = Canvas.createCanvas(600, 200);
const ctx = canvas.getContext("2d");

module.exports = {
  name: "welcome",
  description: "Greets users while joining the server.",
  execute(message) {
    (async () => {
      //background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      //username
      ctx.font = "bold 30px sans";
      ctx.fillStyle = "#262626";
      ctx.textAlign = "start";
      ctx.fillText(`${message.author.username}`, canvas.width / 2, 85);

      //Welcome message
      ctx.font = "normal 30px sans";
      ctx.textAlign = "end";
      ctx.fillStyle = "#262626";
      ctx.fillText("Welcome to", canvas.width / 2 - 10, 175);

      //Server name
      ctx.font = "bold 30px sans";
      ctx.fillStyle = "#262626";
      ctx.textAlign = "start";
      ctx.fillText(message.guild.name, canvas.width / 2, 175);

      // avatar
      ctx.beginPath();
      ctx.arc(canvas.width / 2 - 70, 69, 50, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      const avatar = await Canvas.loadImage(
        message.author.displayAvatarURL({ format: "jpeg" })
      );
      ctx.drawImage(avatar, canvas.width / 2 - 120, 19, 100, 100);

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        "welcome-image.png"
      );
      message.channel.send(attachment);
    })();
  },
};
