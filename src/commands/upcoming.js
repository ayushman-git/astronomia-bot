const name = "upcoming";
const { MessageEmbed } = require("discord.js");
const commandUsage = require("../support/commandUsage");

const flightEmbedGen = (index, flights) => {
  const currentFlightEmbed = new MessageEmbed()
    .setColor("#F0386B")
    .setTitle(flights[index].name)
    .setImage(flights[index].image)
    .addFields({
      name: "📅 Launch Date",
      value: `\`\`\`prolog\n ${new Date(flights[index].net).toLocaleDateString(
        "en-UK",
        {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )} at ${new Date(flights[index].net).toLocaleTimeString("en-US", {
        hour12: true,
        timeStyle: "short",
      })}\`\`\``,
    })
    .setTimestamp()
    .setFooter(
      "Generated by astronomia with TheSpaceDevs API",
      "https://go4liftoff.com/static/favicon.ico"
    );
  if (flights[index].mission) {
    currentFlightEmbed.setDescription(
      `\`\`\`css\n ${flights[index].mission.description}\`\`\``
    );
  }
  if (flights[index].launch_service_provider) {
    currentFlightEmbed.addField(
      "Launch Provider",
      `\`\`\`${flights[index].launch_service_provider.name}\`\`\``,
      true
    );
  }
  if (flights[index].pad) {
    currentFlightEmbed.addField(
      "Launch Pad",
      `\`\`\`${flights[index].pad.name}\`\`\``,
      true
    );
  }
  if (flights[index].mission) {
    currentFlightEmbed.addField(
      "Flight Type",
      `\`\`\`${flights[index].mission.type}\`\`\``,
      true
    );
  }
  if (flights[index].pad.location.name) {
    currentFlightEmbed.addField(
      "Launch location",
      `\`\`\`${flights[index].pad.location.name}\`\`\``,
      true
    );
  }
  if (flights[index].pad.map_image) {
    currentFlightEmbed.addField("\u200b", "\u200b");
    currentFlightEmbed.addField(
      "\u200b",
      `[Pad Location](${flights[index].pad.map_image})`,
      true
    );
  }
  if (flights[index].pad.wiki_url) {
    currentFlightEmbed.addField(
      "\u200b",
      `[Wiki](${flights[index].pad.wiki_url})`,
      true
    );
  }
  return currentFlightEmbed;
};

const eventEmbedGen = (index, events) => {
  const currentEventEmbed = new MessageEmbed()
    .setColor("#F0386B")
    .setTitle(events[index].name)
    .setImage(events[index].feature_image)
    .setURL(events[index].news_url)
    .setDescription(`\`\`\`css\n ${events[index].description}\`\`\``)
    .addFields(
      {
        name: "📅 Event Date",
        value: `\`\`\`prolog\n ${new Date(
          events[index].date
        ).toLocaleDateString("en-UK", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        })} at ${new Date(events[index].date).toLocaleTimeString("en-US", {
          hour12: true,
          timeStyle: "short",
        })}\`\`\``,
      },
      {
        name: "Type",
        value: events[index].type.name,
        inline: true,
      },
      {
        name: "Event Location",
        value: events[index].location,
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
      }
    )
    .setTimestamp()
    .setFooter(
      "Generated by astronomia with TheSpaceDevs API",
      "https://go4liftoff.com/static/favicon.ico"
    );
  if (events[index].launches.length) {
    if (events[index].launches[0].launch_service_provider != null) {
      currentEventEmbed.addField(
        "Launch Provider",
        `\`\`\`${events[index].launches[0].launch_service_provider.name}\`\`\``,
        true
      );
    }
    if (events[index].launches[0].program[0]) {
      currentEventEmbed.addField(
        "Program",
        `\`\`\`${events[index].launches[0].program[0].name}\`\`\``,
        true
      );
      currentEventEmbed.addField(
        "Agency",
        `\`\`\`${events[index].launches[0].program[0].agencies[0].name}\`\`\``,
        true
      );
    }
    if (events[index].launches[0].pad) {
      currentEventEmbed.addField("\u200b", "\u200b");
      currentEventEmbed.addField(
        "\u200b",
        `[Wiki](${events[index].launches[0].pad.wiki_url})`,
        true
      );
      currentEventEmbed.addField(
        "\u200b",
        `[Map](${events[index].launches[0].pad.map_url})`,
        true
      );
    }
  }
  return currentEventEmbed;
};

const initialIndex = (flights) => {
  const currentDate = new Date();
  for (let i = 0; i < flights.length; i++) {
    const flightDate = new Date(flights[i].net);
    if (currentDate < flightDate) {
      return i;
    }
  }
};

const eventIndexCalc = (events) => {
  const currentDate = new Date();
  for (let i = 0; i < events.length; i++) {
    const eventDate = new Date(events[i].date);
    if (currentDate < eventDate) {
      return i;
    }
  }
};

module.exports = {
  name,
  aliases: ["up"],
  description: "Displays upcoming events/flights",
  async execute(message, args, client, db) {
    commandUsage(name, db);
    const APIDataRef = db.collection("fetchObjects").doc("APIData");
    const doc = await APIDataRef.get();
    const events = JSON.parse(doc.data().events);
    const flights = JSON.parse(doc.data().flights);
    
    let msgID = null;
    let messageInstance = null;
    let globalIndex = initialIndex(flights);
    const eventIndex = eventIndexCalc(events);

    message.channel.startTyping();
    client.on("messageReactionAdd", async (reaction, user) => {
      if (user.bot) {
        return;
      }
      if (msgID === reaction.message.id) {
        if (reaction._emoji.name === "▶") {
          message.reactions.resolve(reaction).users.remove(user);
          if (globalIndex >= flights.length - 1) {
            return;
          }
          globalIndex++;
          messageInstance.edit(flightEmbedGen(globalIndex, flights));
        } else if (reaction._emoji.name === "◀") {
          message.reactions.resolve(reaction).users.remove(user);
          if (globalIndex < 1) {
            globalIndex = 0;
          } else {
            globalIndex--;
          }
          messageInstance.edit(flightEmbedGen(globalIndex, flights));
        }
      }
    });
    if (args.length === 0) {
      message.channel
        .send(flightEmbedGen(globalIndex, flights))
        .then(async (msg) => {
          messageInstance = msg;
          msgID = msg.id;
          await msg.react("◀");
          await msg.react("▶");
        });
    } else if (args[0].match(/(event)|(events)/g)) {
      message.channel.send(eventEmbedGen(eventIndex, events));
    } else {
      message.channel.send("Please enter a valid command.");
    }
    message.channel.stopTyping();
  },
};
