const currentVersion = "0.0.2"

module.exports = {
  name: "version",
  aliases: ["v"],
  description: "Check version",
  execute(message, args) {
    message.channel.send(currentVersion)
  }
}