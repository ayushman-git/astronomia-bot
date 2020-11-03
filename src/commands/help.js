const path = require("path");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const attachment = new MessageAttachment(
  path.join(__dirname, "../assets/images/logo.png"),
  "logo.png"
);
const embed = new MessageEmbed()
  .setColor("#F0386B")
  .setTitle("Astronomia commands")
  .attachFiles(attachment)
  .setThumbnail("attachment://logo.png")
  .addFields(
    {
      name: "Help",
      value: ".hi\n.hi \u200B <language>",
      inline: true,
    },
    {
      name: "🍧",
      value:
        "Greets user in a random language.\nGreets user in specified language.",
      inline: true,
    },
    { name: "\u200B", value: "\u200B" },
    {
      name: "Version",
      value: ".version\n.v",
      inline: true,
    },
    {
      name: "🥓",
      value: "Displays current version of the bot.",
      inline: true,
    },
    { name: "\u200B", value: "\u200B" },
    {
      name: "Facts",
      value: ".facts\n.f",
      inline: true,
    },
    {
      name: "🍰",
      value: "Displays a random fact about universe.",
      inline: true,
    },
    { name: "\u200B", value: "\u200B" },
    {
      name: "Quotation",
      value: ".quotes\n.q",
      inline: true,
    },
    {
      name: "🍰",
      value: "Displays a random quote about cosmos.",
      inline: true,
    },
    { name: "\u200B", value: "\u200B" },
    {
      name: "Explore",
      value: ".explore \u200B <object>\n.e \u200B <object>",
      inline: true,
    },
    {
      name: "🍦",
      value: "Displays stats about a specified celestial object.",
      inline: true,
    },
    { name: "\u200B", value: "\u200B" },
    {
      name: "Photo of the Day",
      value: ".apod",
      inline: true,
    },
    {
      name: "🍩",
      value: "Displays astronomy photo of the day.",
      inline: true,
    },

    { name: "\u200B", value: "\u200B" },
    {
      name: "Wallpapers",
      value: ".wallpapers\n.w\n.w \u200B *real*",
      inline: true,
    },
    {
      name: "🍱",
      value: "Displays wallpaper.\n\nDisplays realistic wallpaper.",
      inline: true,
    },
    {
      name: "❤",
      value: "If you want latest news regarding space, create a text channel named **astronomia**",
      inline: false,
    },
  )
  .setTimestamp()
  .setFooter(
    "Generated by astronomia with NASA's APOD API",
    "https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png"
  );

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "Displays list of all commands.",
  execute(message, args) {
    message.channel.send(embed);
  },
};
