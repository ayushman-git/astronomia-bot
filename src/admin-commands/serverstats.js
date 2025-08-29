const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Show bot server count and estimated total member count"),
  cooldown: 3,
  ownerOnly: true, // Custom property to mark as owner-only
  async execute(interaction, client) {
    // Check if user is bot owner
    const botOwnerIds = [process.env.BOT_OWNER_ID || "YOUR_DISCORD_USER_ID"]; 
    
    if (!botOwnerIds.includes(interaction.user.id)) {
      await interaction.reply({ 
        content: "❌ This command is restricted to bot administrators only.", 
        ephemeral: true 
      });
      return;
    }
    
    let totalMembers = 0;
    client.guilds.cache.forEach((g) => {
      totalMembers += g.memberCount ?? 0;
    });
    await interaction.reply({ 
      content: `🔧 **Admin Stats**\nServers: ${client.guilds.cache.size} | Members: ${totalMembers}`,
      ephemeral: true
    });
  },
};
