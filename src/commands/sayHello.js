const helloGif = [
  "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif",
  "https://media.giphy.com/media/xTk9ZY0C9ZWM2NgmCA/giphy.gif",
  "https://media.giphy.com/media/Cmr1OMJ2FN0B2/giphy.gif",
  "https://media.giphy.com/media/ZgTRcH0SbiLV1wolnR/giphy.gif",
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
let randomKey = greetings[keys[(keys.length * Math.random()) << 0]];

const greeting = function (rKey) {
  if (typeof rKey == "string") {
    if (typeof greetings[rKey] == "string") {
      return greetings[rKey];
    } else {
      return greetings[rKey][Math.floor(Math.random() * greetings[rKey].length)];
    }
  }
  if (typeof rKey === "string") {
    return rKey;
  } else {
    return rKey[Math.floor(Math.random() * rKey.length)];
  }
};

module.exports = {
  name: "hello",
  aliases: ["hi"],
  description: "Greet users",
  execute(message, args) {
    let randomGreeting = null;
    if (!args.length) {
      randomGreeting = greeting(randomKey);
      message.channel.send({
        files: [helloGif[Math.floor(Math.random() * helloGif.length)]],
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
          files: [helloGif[Math.floor(Math.random() * helloGif.length)]],
        });
        message.channel.send(`${randomGreeting} <@${message.author.id}>`);
      }
      else {
        message.channel.send("Please enter a valid language.")
      }
    }
  },
};
