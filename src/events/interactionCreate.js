const incXP = require("../support/increaseXP");

module.exports = function registerInteractionCreate(client, db) {
  client.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

      // Handle buttons that belong to a command (pagination, etc.)
      if (interaction.isButton()) {
        const [scope, commandName] = (interaction.customId || "").split(":");
        if (scope === "cmd" && client.commands.has(commandName)) {
          const handler = client.commands.get(commandName);
          if (typeof handler.handleButton === "function") {
            await handler.handleButton(interaction, client, db);
          }
        }
        return;
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Optional permission check
      if (command.memberPermissions && interaction.inGuild()) {
        const missing = command.memberPermissions.filter((p) => !interaction.memberPermissions?.has(p));
        if (missing.length) {
          return interaction.reply({ content: "You lack permission to use this command.", ephemeral: true });
        }
      }

      // Cooldowns per user per command
      const cooldowns = client.cooldowns;
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name) || new Map();
      const cooldownAmount = (command.cooldown ?? 6) * 1000; // default 6s
      if (timestamps.has(interaction.user.id)) {
        const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
        if (now < expirationTime) {
          const secondsLeft = Math.ceil((expirationTime - now) / 1000);
          return interaction.reply({
            content: `Please wait ${secondsLeft}s before reusing this command.`,
            ephemeral: true,
          });
        }
      }
      timestamps.set(interaction.user.id, now);
      cooldowns.set(command.data.name, timestamps);

      await command.execute(interaction, client, db);

      // XP gain except for rank/level
      if (!["rank", "level"].includes(command.data.name)) {
        incXP(interaction.user.id, db);
      }
    } catch (err) {
      console.error(err);
      if (interaction.isRepliable?.()) {
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({ content: "There was an error.", ephemeral: true });
        } else {
          await interaction.reply({ content: "There was an error.", ephemeral: true });
        }
      }
    }
  });
};
