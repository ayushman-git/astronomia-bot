const fs = require("fs");
const path = require("path");

module.exports = function loadSlashCommands(client) {
  const commandsPath = path.join(__dirname, "..", "slash-commands");
  if (!fs.existsSync(commandsPath)) return;
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const command = require(path.join(commandsPath, file));
    if (command?.data?.name) {
      client.commands.set(command.data.name, command);
    }
  }
};

