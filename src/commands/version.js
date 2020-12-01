const currentVersion = "0.4.5"

module.exports = {
  name: "version",
  aliases: ["v"],
  description: "Check version",
  execute(message, args) {
    message.channel.send(currentVersion)
  }
}