const name = "help";

const path = require("path");
const commandUsage = require("../support/commandUsage")

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
      name: "```Greeting```",
      value: `\`\`\`css\n.hi - Greets user\n.hi <language> - Greets user in specified language\`\`\``,
    },
    {
      name: "```Version```",
      value: `\`\`\`css\n.version - Displays current bot version\n.v\`\`\``,
    },
    {
      name: "```Facts```",
      value: `\`\`\`css\n.fact - Displays a random fact about our universe\n.f\`\`\``,
    },
    {
      name: "```Quotes```",
      value: `\`\`\`css\n.quote - Displays a random quote\n.q\`\`\``,
    },
    {
      name: "```Explore```",
      value: `\`\`\`css\n.explore <object> - Displays info about a specified celestial object\n.e <object>\nEg. .e moon\`\`\``,
    },
    {
      name: "```Photo of the Day```",
      value: `\`\`\`css\n.apod - Displays astronomy photo of the day\`\`\``,
    },
    {
      name: "```Wallpapers```",
      value: `\`\`\`css\n.wallpaper - Displays a beautiful wallpaper\n.w real - Displays realistic wallpaper\`\`\``,
    },
    {
      name: "```Movies```",
      value: `\`\`\`css\n.movie - Suggest a random movie\n.m\`\`\``,
    },
    {
      name: "```Extra Features```",
      value: `\`\`\`coffeescript\nTo stay updated with astronomy news create a text channel with name - "astronomia"\`\`\``,
    }
  )
  .setTimestamp()
  .setFooter(
    "Happy Exploring",
  );

module.exports = {
  name,
  aliases: ["h"],
  description: "Displays list of all commands.",
  execute(message, args, client, db) {
    commandUsage(name, db);
    message.channel.send(embed).then(async(msg) => {
      await msg.react("👽")
    })
  },
};
