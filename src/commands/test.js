const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "test",
  description: "Test new commands",
  execute(message, args, client) {
    const embed = new MessageEmbed().setDescription("Checking")
    .addField('something', '[Read More](https://www.youtube.com/watch?v=sA2CHo-P4l8)')
    message.channel.send(embed);
  },
};
