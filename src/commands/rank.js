const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "rank",
  aliases: ["r"],
  description: "Check version",
  async execute(message, args, client, db) {
    message.channel.startTyping();
    const statsRef = db.collection("fetchObjects").doc("userXp");
    const doc = await statsRef.get();
    const stats = Object.entries(doc.data());
    const sortedStats = stats.sort((a, b) => b[1] - a[1]).splice(0, 5);
    const topFive = [];
    sortedStats.forEach((user) => {
      client.users
        .fetch(user[0])
        .then((data) => {
          topFive.push(data.username);
        })
        .then(async () => {
          if (topFive.length >= 5) {
            const embed = new MessageEmbed()
              .setColor("#F0386B")
              .setTitle("Top Explorers")
              // .setImage(currentApod.url)
              .setDescription(`**${topFive[0]}** is the best astronomer here. 🥳🥳`)
              .setThumbnail()
              .addFields(
                {
                  name: "\u200b",
                  value: `\`\`\`css\n 1 - ${topFive[0]}\`\`\``,
                },
                {
                  name: "\u200b",
                  value: `\`\`\`css\n 2 - ${topFive[1]}\`\`\``,
                },
                {
                  name: "\u200b",
                  value: `\`\`\`css\n 3 - ${topFive[2]}\`\`\``,
                },
                {
                  name: "\u200b",
                  value: `\`\`\` 4 - ${topFive[3]}\`\`\``,
                },
                {
                  name: "\u200b",
                  value: `\`\`\` 5 - ${topFive[4]}\`\`\``,
                }
              );
            // .setFooter(
            //   `${publicationDate.getDate()}/${
            //     publicationDate.getMonth() + 1
            //   }/${publicationDate.getFullYear()}`
            // );
            await client.users.fetch(sortedStats[0][0]).then((data) => {
              embed.setThumbnail(
                data.displayAvatarURL({ format: "jpg", size: 256 })
              );
            });
            message.channel.send(embed);
            message.channel.stopTyping();
          }
        });
    });
  },
};
