const currentVersion = "0.2.0"

module.exports = {
  name: "version",
  aliases: ["v"],
  description: "Check version",
  execute(message, args) {
    message.channel.send(currentVersion)
  }
}