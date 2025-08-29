const { SlashCommandBuilder } = require("@discordjs/builders");
const path = require("path");

const helloGif = ["awk.gif", "obi.gif", "bear.gif", "cartoon.gif", "minion.gif", "omellete.gif", "pig.gif"]; 
const greetings = {
  french: "Bonjour",
  spanish: "Hola! Mucho gusto.",
  italian: "Ciao! Come stai?",
  english: ["Peek-a-boo!", "Howdy-doody!", "Ahoy, matey!", "What’s crackin’?", "Yo!"],
  japanese: ["Kon'nichiwa", "こんにちは"],
  german: ["Guten Tag", "Hallo"],
  portugese: ["Olá ", "Oi!"],
};

function pickGreeting(key) {
  const v = greetings[key];
  if (!v) return null;
  return typeof v === "string" ? v : v[Math.floor(Math.random() * v.length)];
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Greet yourself with a random gif")
    .addStringOption((opt) =>
      opt
        .setName("language")
        .setDescription("Pick a language")
        .addChoices(
          ...Object.keys(greetings).map((k) => ({ name: k, value: k }))
        )
    ),
  cooldown: 3,
  async execute(interaction) {
    const lang = interaction.options.getString("language");
    const greeting = lang ? pickGreeting(lang) : pickGreeting(Object.keys(greetings)[Math.floor(Math.random() * Object.keys(greetings).length)]);
    const file = path.join(__dirname, "..", "assets", "images", helloGif[Math.floor(Math.random() * helloGif.length)]);
    await interaction.reply({ files: [file], content: `${greeting} <@${interaction.user.id}>` });
  },
};

