const incXP = require("../support/increaseXP");

const PREFIX = process.env.DEV ? "test." : ".";

const messageHandler = (client, db) => {
  const usedCommandRecently = new Set();

  client.on("message", (msg) => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
    const [CMD_NAME, ...args] = msg.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    const command =
      client.commands.get(CMD_NAME) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(CMD_NAME)
      );

    if (!command) return;
    try {
      if (usedCommandRecently.has(msg.author.id)) {
        msg.reply("You can not use commands. Wait 6 seconds.");
      } else {
        command.execute(msg, args, client, db);
        if (command.name != "level" || command.name != "rank") {
          incXP(msg.author.id, db);
        }
        usedCommandRecently.add(msg.author.id);
        setTimeout(() => {
          usedCommandRecently.delete(msg.author.id);
        }, 6000);
      }
    } catch (err) {
      console.log(err);
      msg.reply("There was an error.");
    }
  });
};

module.exports = messageHandler;
