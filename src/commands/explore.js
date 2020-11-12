const path = require("path");
const axios = require("axios");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const images = require("../assets/images");
const attachment = new MessageAttachment(
  path.join(__dirname, "../assets/images/logo.png"),
  "logo.png"
);

module.exports = {
  name: "explore",
  aliases: ["e"],
  description: "Explore universe",
  async execute(message, args) {
    args[0] = args[0].toLowerCase();
    if (!args[0]) {
      message.channel.send("Please enter celestial obbject's name.");
    } else {
      const gen = await message.channel.send("Generating...");
      axios
        .get("https://api.le-systeme-solaire.net/rest/bodies/" + args[0])
        .then((res) => {
          const celestialObject = new MessageEmbed()
            .setColor("#F0386B")
            .setTitle(
              res.data.name == res.data.englishName
                ? res.data.englishName
                : `${res.data.englishName} (${res.data.name})`
            )
            .attachFiles(attachment)
            .setThumbnail("attachment://logo.png")

            .addFields(
              {
                name: "```Density```",
                value: res.data.density.toFixed(2) + " g/cm^3",
                inline: true,
              },
              {
                name: "```Gravity```",
                value: res.data.gravity + " m/s^2",
                inline: true,
              },
              {
                name: "```Moons```",
                value: res.data.moons ? Object.keys(res.data.moons).length : 0,
                inline: true,
              },
              {
                name: "```Mass```",
                value: `
                    ${res.data.mass.massValue.toFixed(2)}^
                    ${res.data.mass.massExponent} kgs
`,
                inline: true,
              },
              {
                name: "```Escape Velocity```",
                value: (res.data.escape / 1000).toFixed(1) + " km/s",
                inline: true,
              },
              {
                name: "```Orbital revolution```",
                value: res.data.sideralOrbit.toFixed(2) + " days",
                inline: true,
              },
              {
                name: "```Rotation speed```",
                value: (res.data.sideralRotation / 24).toFixed(2) + " days",
                inline: true,
              },
              {
                name: "```Radius```",
                value: res.data.meanRadius.toFixed(2) + " kms",
                inline: true,
              }
            )
            .setTimestamp()
            .setFooter(
              "Generated by astronomia with Solar System OpenData API",
              "https://api.le-systeme-solaire.net/assets/images/logo.png"
            );
          if (images[args[0]].description) {
            celestialObject
              .setDescription(`\`\`\` ${images[args[0]].description}\`\`\``)
              .setImage(images[args[0]].link);
          }
          if (res.data.discoveredBy) {
            celestialObject.addFields({
              name: "```Discovered By```",
              value: res.data.discoveredBy,
              inline: true,
            });
          }
          if (res.data.discoveryDate) {
            celestialObject.addFields({
              name: "```Discovered On```",
              value: res.data.discoveryDate,
              inline: true,
            });
          }
          message.channel.send(celestialObject);
        });
      setTimeout(() => {
        gen.delete();
      }, 1000);
    }
  },
};
