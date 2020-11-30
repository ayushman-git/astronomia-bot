const name = "hello";
const commandUsage = require("../support/commandUsage")

const path = require("path");
const helloGif = [
  "awk.gif",
  "obi.gif",
  "bear.gif",
  "cartoon.gif",
  "minion.gif",
  "omellete.gif",
  "pig.gif",
];

const greetings = {
  french: "Bonjour",
  spanish: "Hola! Mucho gusto.",
  italian: "Ciao! Come stai?",
  english: [
    "Peek-a-boo!",
    "Howdy-doody!",
    "Ahoy, matey!",
    "What’s crackin’?",
    "Yo!",
  ],
  japanese: ["Kon'nichiwa", "こんにちは"],
  german: ["Guten Tag", "Hallo"],
  portugese: ["Olá ", "Oi!"],
};
const keys = Object.keys(greetings);
let randomKey = null;

module.exports = {
  name,
  aliases: ["hi", "ahoy", "hii", "ciao", "hola"],
  description: "Greet users",
  execute(message, args, client, db) {
    commandUsage(name, db);

    const greeting = function (rKey) {
      if (typeof greetings[rKey] == "string") {
        return greetings[rKey];
      } else {
        return greetings[rKey][
          Math.floor(Math.random() * greetings[rKey].length)
        ];
      }
    };
    let randomGreeting = null;
    if (!args.length) {
      randomKey = keys[Math.floor(Math.random() * keys.length)];
      randomGreeting = greeting(randomKey);
      message.channel.send({
        files: [
          path.join(
            __dirname,
            "../assets/images",
            helloGif[Math.floor(Math.random() * helloGif.length)]
          ),
        ],
      });
      message.channel.send(`${randomGreeting} <@${message.author.id}>`);
    } else {
      if (
        keys.find((key) => {
          return key == args[0];
        })
      ) {
        randomGreeting = greeting(args[0]);
        message.channel.send({
          files: [
            path.join(
              __dirname,
              "../assets/images",
              helloGif[Math.floor(Math.random() * helloGif.length)]
            ),
          ],
        });
        message.channel.send(`${randomGreeting} <@${message.author.id}>`);
      } else {
        message.channel.send("Please enter a valid language.");
      }
    }
  },
};
