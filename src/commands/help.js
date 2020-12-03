const name = "help";

const path = require("path");
const commandUsage = require("../support/commandUsage");

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
      name: "```Daily News```",
      value: `\`\`\`coffeescript\nTo stay updated with astronomy news, create a text channel with name - "astronomia"\`\`\``,
    },
    {
      name: "```Upcoming Launches/Events```",
      value: `\`\`\`css\n.upcoming - Shows upcoming flight launches.\n.upcoming events - Displays the next astronomy event.\`\`\``,
    },
    {
      name: "```Astronauts```",
      value: `\`\`\`css\n.astronaut - Shows list of all astronauts.\n.astronaut <name> - Displays specified astronaut's detail.\`\`\``,
    },
    {
      name: "```Explore```",
      value: `\`\`\`css\n.explore <object> - Displays info about a specified celestial object\n.e <object>\nEg. .e moon\`\`\``,
    },
    {
      name: "```Sky/Moon view```",
      value: `\`\`\`css\n.sky red|black|white|navy(optional) <location> - Displays sky of specified location.\nEg. .sky red madrid\n.moonphase <location> - Displays moon's phase of given location.\`\`\``,
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
      name: "```Miscellaneous```",
      value: `\`\`\`css\n.movie, .fact, .quote, .hi | .hi <language>\`\`\``,
    },
    {
      name: "\u200b",
      value: `You can visit [astronomia](https://ayushman-git.github.io/astronomia-site/) site if you want to learn something extra.`,
    },
  )
module.exports = {
  name,
  aliases: ["h"],
  description: "Displays list of all commands.",
  execute(message, args, client, db) {
    commandUsage(name, db);
    message.channel.send(embed).then(async (msg) => {
      await msg.react("🛸");
    });
  },
};
