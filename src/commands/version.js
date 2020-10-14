const currentVersion = "0.0.6"

module.exports = {
  name: "version",
  aliases: ["v"],
  description: "Check version",
  execute(message, args) {
    message.channel.send(currentVersion)
  }
}