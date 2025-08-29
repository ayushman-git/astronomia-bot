const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function flightEmbedGen(index, flights) {
  const f = flights[index];
  const embed = new EmbedBuilder()
    .setColor("#F0386B")
    .setTitle(f.name)
    .setImage(f.image)
    .addFields({
      name: "📅 Launch Date",
      value: ` ${new Date(f.net).toLocaleDateString("en-UK", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} at ${new Date(f.net).toLocaleTimeString("en-US", { hour12: true, timeStyle: "short" })}`,
    })
    .setTimestamp(new Date())
    .setFooter({ text: "Astronomia • TheSpaceDevs API", iconURL: "https://go4liftoff.com/static/favicon.ico" });
  if (f.mission) {
    embed.setDescription(f.mission.description);
  }
  if (f.launch_service_provider) {
    embed.addFields({ name: "Launch Provider", value: f.launch_service_provider.name, inline: true });
  }
  if (f.pad) {
    embed.addFields(
      { name: "Launch Pad", value: f.pad.name, inline: true },
      f.mission ? { name: "Flight Type", value: f.mission.type, inline: true } : { name: "\u200b", value: "\u200b" },
      f.pad.location?.name ? { name: "Launch location", value: f.pad.location.name, inline: true } : { name: "\u200b", value: "\u200b" }
    );
    if (f.pad.map_image) {
      embed.addFields({ name: "\u200b", value: `[Pad Location](${f.pad.map_image})`, inline: true });
    }
    if (f.pad.wiki_url) {
      embed.addFields({ name: "\u200b", value: `[Wiki](${f.pad.wiki_url})`, inline: true });
    }
  }
  return embed;
}

function eventEmbedGen(index, events) {
  const e = events[index];
  const embed = new EmbedBuilder()
    .setColor("#F0386B")
    .setTitle(e.name)
    .setImage(e.feature_image)
    .setURL(e.news_url)
    .setDescription(e.description)
    .addFields(
      {
        name: "📅 Event Date",
        value: ` ${new Date(e.date).toLocaleDateString("en-UK", {
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
        })} at ${new Date(e.date).toLocaleTimeString("en-US", { hour12: true, timeStyle: "short" })}`,
      },
      { name: "Type", value: e.type?.name || "-", inline: true },
      { name: "Event Location", value: e.location || "-", inline: true }
    )
    .setTimestamp(new Date())
    .setFooter({ text: "Astronomia • TheSpaceDevs API", iconURL: "https://go4liftoff.com/static/favicon.ico" });
  if (e.launches?.length) {
    const l = e.launches[0];
    if (l.launch_service_provider) {
      embed.addFields({ name: "Launch Provider", value: l.launch_service_provider.name, inline: true });
    }
    if (l.program?.[0]) {
      embed.addFields(
        { name: "Program", value: l.program[0].name, inline: true },
        { name: "Agency", value: l.program[0].agencies?.[0]?.name || "-", inline: true }
      );
    }
    if (l.pad) {
      if (l.pad.wiki_url) embed.addFields({ name: "\u200b", value: `[Wiki](${l.pad.wiki_url})`, inline: true });
      if (l.pad.map_url) embed.addFields({ name: "\u200b", value: `[Map](${l.pad.map_url})`, inline: true });
    }
  }
  return embed;
}

function initialIndex(items, key) {
  const now = new Date();
  for (let i = 0; i < items.length; i += 1) {
    const d = new Date(items[i][key]);
    if (now < d) return i;
  }
  return 0;
}

function controlsRow(commandName, index) {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`cmd:${commandName}:prev:${index}`).setStyle(ButtonStyle.Secondary).setLabel("Prev"),
    new ButtonBuilder().setCustomId(`cmd:${commandName}:next:${index}`).setStyle(ButtonStyle.Secondary).setLabel("Next")
  );
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upcoming")
    .setDescription("Show upcoming launches or events")
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Show flights or events")
        .addChoices({ name: "flights", value: "flights" }, { name: "events", value: "events" })
    ),
  cooldown: 6,
  async execute(interaction, client, db) {
    const type = interaction.options.getString("type") || "flights";
    await interaction.deferReply();

    const APIDataRef = db.collection("fetchObjects").doc("APIData");
    const doc = await APIDataRef.get();
    const events = JSON.parse(doc.data().events || "[]");
    const flights = JSON.parse(doc.data().flights || "[]");

    if (type === "events") {
      const idx = initialIndex(events, "date");
      await interaction.editReply({ embeds: [eventEmbedGen(idx, events)] });
    } else {
      const idx = initialIndex(flights, "net");
      await interaction.editReply({ embeds: [flightEmbedGen(idx, flights)], components: [controlsRow("upcoming", idx)] });
    }
  },
  async handleButton(interaction, client, db) {
    const [, commandName, action, currentIndexStr] = interaction.customId.split(":");
    if (commandName !== "upcoming") return;
    const currentIndex = parseInt(currentIndexStr, 10) || 0;
    const APIDataRef = db.collection("fetchObjects").doc("APIData");
    const doc = await APIDataRef.get();
    const flights = JSON.parse(doc.data().flights || "[]");
    let idx = currentIndex;
    if (action === "next") idx = Math.min(flights.length - 1, currentIndex + 1);
    if (action === "prev") idx = Math.max(0, currentIndex - 1);
    await interaction.update({ embeds: [flightEmbedGen(idx, flights)], components: [controlsRow("upcoming", idx)] });
  },
};

