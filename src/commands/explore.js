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
                name: "Density",
                value: res.data.density.toFixed(2) + " g/cm^3",
                inline: true,
              },
              {
                name: "Gravity",
                value: res.data.gravity + " m/s^2",
                inline: true,
              },
              {
                name: "Moons",
                value: res.data.moons ? Object.keys(res.data.moons).length : 0,
                inline: true,
              },
              {
                name: "Mass",
                value: `
                    ${res.data.mass.massValue.toFixed(2)}^
                    ${res.data.mass.massExponent} kgs
`,
                inline: true,
              },
              {
                name: "Escape Velocity",
                value: (res.data.escape / 1000).toFixed(1) + " km/s",
                inline: true,
              },
              {
                name: "Orbital revolution",
                value: res.data.sideralOrbit.toFixed(2) + " days",
                inline: true,
              },
              {
                name: "Rotation speed",
                value: (res.data.sideralRotation / 24).toFixed(2) + " days",
                inline: true,
              },
              {
                name: "Radius",
                value: res.data.meanRadius.toFixed(2) + " kms",
                inline: true,
              }
            )
            .setTimestamp()
            .setFooter(
              "Generated by astronomia with Solar System OpenData API",
              "https://api.le-systeme-solaire.net/assets/images/logo.png"
            );
          if (res.data.discoveredBy) {
            celestialObject.addFields({
              name: "Discovered By",
              value: res.data.discoveredBy,
              inline: true,
            });
          }
          if (res.data.discoveryDate) {
            celestialObject.addFields({
              name: "Discovered On",
              value: res.data.discoveryDate,
              inline: true,
            });
          }

          if (args[0] == "moon") {
            celestialObject
              .setImage(images.moon)
              .setDescription(
                "The brightest and largest object in our night sky, the Moon makes Earth a more livable planet by moderating our home planet's wobble on its axis, leading to a relatively stable climate. It also causes tides, creating a rhythm that has guided humans for thousands of years. The Moon was likely formed after a Mars-sized body collided with Earth."
              );
          }
          else if(args[0] == "sun") {
            celestialObject
              .setImage(images.sun)
              .setDescription(
                "The Sun—the heart of our solar system—is a yellow dwarf star, a hot ball of glowing gases."
              );
          }
          else if(args[0] == "earth") {
            celestialObject
              .setImage(images.earth)
              .setDescription(
                "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands. The remaining 71% is covered with water, mostly by oceans but also lakes, rivers and other fresh water, which together constitute the hydrosphere."
              );
          }
          else if(args[0] == "mars") {
            celestialObject
              .setImage(images.mars)
              .setDescription(
                "It is the fourth planet from the Sun. It is the next planet beyond Earth. Mars is more than 142 million miles from the Sun. The planet is about half the size of Earth."
              );
          }
          else if(args[0] == "jupiter") {
            celestialObject
              .setImage(images.jupiter)
              .setDescription(
                "Jupiter has a long history surprising scientists—all the way back to 1610 when Galileo Galilei found the first moons beyond Earth. That discovery changed the way we see the universe."
              );
          }
          message.channel.send(celestialObject);
        });
      setTimeout(() => {
        gen.delete();
      }, 1000);
    }
  },
};
