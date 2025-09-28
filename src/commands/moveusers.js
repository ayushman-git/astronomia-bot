const name = "moveusers";
const { PermissionsBitField } = require("discord.js");
const commandUsage = require("../support/commandUsage");

module.exports = {
  name,
  aliases: ["move", "movemembers"],
  description: "Move all users from one voice channel to another",
  usage: ".moveusers <from_channel_name> <to_channel_name>",
  execute(message, args, client, db) {
    commandUsage(name, db);

    // Check if user has permission to move members
    if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
      return message.reply("❌ You don't have permission to move members between voice channels.");
    }

    // Check if both channel names are provided
    if (args.length < 2) {
      return message.reply("❌ Please provide both channel names.\nUsage: `.moveusers <from_channel_name> <to_channel_name>`");
    }

    const fromChannelName = args[0].toLowerCase();
    const toChannelName = args.slice(1).join(" ").toLowerCase();

    // Find voice channels by name
    const fromChannel = message.guild.channels.cache.find(
      channel => channel.type === 2 && channel.name.toLowerCase() === fromChannelName
    );

    const toChannel = message.guild.channels.cache.find(
      channel => channel.type === 2 && channel.name.toLowerCase() === toChannelName
    );

    // Check if channels exist
    if (!fromChannel) {
      return message.reply(`❌ Voice channel "${args[0]}" not found.`);
    }

    if (!toChannel) {
      return message.reply(`❌ Voice channel "${args.slice(1).join(" ")}" not found.`);
    }

    // Check if bot has permission to move members in both channels
    if (!fromChannel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.MoveMembers)) {
      return message.reply(`❌ I don't have permission to move members from "${fromChannel.name}".`);
    }

    if (!toChannel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.MoveMembers)) {
      return message.reply(`❌ I don't have permission to move members to "${toChannel.name}".`);
    }

    // Get members in the from channel
    const membersToMove = fromChannel.members;

    if (membersToMove.size === 0) {
      return message.reply(`📭 No members found in voice channel "${fromChannel.name}".`);
    }

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

    Promise.all(movePromises).then(() => {
      let responseMessage = `🔄 Successfully moved ${movedCount} member(s) from "${fromChannel.name}" to "${toChannel.name}".`;
      
      if (failedCount > 0) {
        responseMessage += `\n⚠️ Failed to move ${failedCount} member(s).`;
      }

      message.reply(responseMessage);
    }).catch(error => {
      console.error("Error moving members:", error);
      message.reply("❌ An error occurred while moving members.");
    });
  },
};