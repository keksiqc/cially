// Imports
const { Events } = require("discord.js");
const { debug } = require("../terminal/debug");
const { sendPostRequest } = require("../http/postRequest");

// Main Event
module.exports = {
	name: Events.InviteCreate,
	execute(invite) {
		// Logs
		debug({
			text: `New Invite: \nGuild: ${invite.guild.name} (${invite.guild.id})\nChannel: ${invite.channel.name} (${invite.channelId})\nInviter: ${invite.inviterId}\n`,
		});

		const info = {
			guildID: invite.guild.id,
			channelID: invite.channelId,
			authorID: invite.inviterId,
		};
		sendPostRequest({
			data: info,
			guildId: invite.guild.id,
			type: module.exports.name,
		});
	},
};
