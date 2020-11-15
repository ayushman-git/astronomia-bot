const activity = [
  {
    text: "Cosmos",
    type: "WATCHING",
  },
  {
    text: "Melody of Space",
    type: "LISTENING",
  },
  {
    text: "Symphony of Life",
    type: "LISTENING",
  },
  {
    text: "with Stars",
    type: "PLAYING",
  },
  {
    text: "evolution",
    type: "STREAMING",
  },
];
module.exports = {
  name: "changeActivity",
  description: "Change bots activity.",
  execute(client) {
    const randomActivity = Math.floor(Math.random() * activity.length);
    client.user.setActivity(activity[randomActivity].text, {
      type: activity[randomActivity].type
    });
  },
};
