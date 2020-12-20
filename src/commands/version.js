const currentVersion = "1.0.0"

module.exports = {
  name: "version",
  description: "Check version",
  execute(message, args) {
    message.channel.send(currentVersion)
  }
}