const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Show bot server count and estimated total member count")
    .setDefaultMemberPermissions(0), // Hide from non-administrators
  cooldown: 3,
  async execute(interaction, client) {
    // Check if user is bot owner (replace with your Discord ID)
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
      content: `Servers: ${client.guilds.cache.size} | Members: ${totalMembers}`,
      ephemeral: true // Make response only visible to the user
    });
  },
};

