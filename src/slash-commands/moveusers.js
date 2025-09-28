const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moveusers")
    .setDescription("Move all users from one voice channel to another")
    .addStringOption(option =>
      option.setName("from_channel")
        .setDescription("Name of the voice channel to move users from")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("to_channel")
        .setDescription("Name of the voice channel to move users to")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),
  cooldown: 5,
  async execute(interaction) {
    // Check if user has permission to move members
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
      await interaction.reply({
        content: "❌ You don't have permission to move members between voice channels.",
        ephemeral: true
      });
      return;
    }

    const fromChannelName = interaction.options.getString("from_channel").toLowerCase();
    const toChannelName = interaction.options.getString("to_channel").toLowerCase();

    // Find voice channels by name
    const fromChannel = interaction.guild.channels.cache.find(
      channel => channel.type === ChannelType.GuildVoice && channel.name.toLowerCase() === fromChannelName
    );

    const toChannel = interaction.guild.channels.cache.find(
      channel => channel.type === ChannelType.GuildVoice && channel.name.toLowerCase() === toChannelName
    );

    // Check if channels exist
    if (!fromChannel) {
      await interaction.reply({
        content: `❌ Voice channel "${interaction.options.getString("from_channel")}" not found.`,
        ephemeral: true
      });
      return;
    }

    if (!toChannel) {
      await interaction.reply({
        content: `❌ Voice channel "${interaction.options.getString("to_channel")}" not found.`,
        ephemeral: true
      });
      return;
    }

    // Check if bot has permission to move members in both channels
    if (!fromChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.MoveMembers)) {
      await interaction.reply({
        content: `❌ I don't have permission to move members from "${fromChannel.name}".`,
        ephemeral: true
      });
      return;
    }

    if (!toChannel.permissionsFor(interaction.guild.members.me).has(PermissionsBitField.Flags.MoveMembers)) {
      await interaction.reply({
        content: `❌ I don't have permission to move members to "${toChannel.name}".`,
        ephemeral: true
      });
      return;
    }

    // Get members in the from channel
    const membersToMove = fromChannel.members;

    if (membersToMove.size === 0) {
      await interaction.reply({
        content: `📭 No members found in voice channel "${fromChannel.name}".`,
        ephemeral: true
      });
      return;
    }

    // Defer reply since moving members might take some time
    await interaction.deferReply();

    // Move all members
    let movedCount = 0;
    let failedCount = 0;

    const movePromises = membersToMove.map(async (member) => {
      try {
        await member.voice.setChannel(toChannel);
        movedCount++;
      } catch (error) {
        console.error(`Failed to move ${member.user.tag}:`, error);
        failedCount++;
      }
    });

    try {
      await Promise.all(movePromises);
      
      let responseMessage = `🔄 Successfully moved ${movedCount} member(s) from "${fromChannel.name}" to "${toChannel.name}".`;
      
      if (failedCount > 0) {
        responseMessage += `\n⚠️ Failed to move ${failedCount} member(s).`;
      }

      await interaction.editReply(responseMessage);
    } catch (error) {
      console.error("Error moving members:", error);
      await interaction.editReply("❌ An error occurred while moving members.");
    }
  },
};