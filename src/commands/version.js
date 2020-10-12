module.exports = {
  name: "version",
  description: "Check version",
  execute(message, args) {
    message.channel.send("version 0.0.1")
  }
}