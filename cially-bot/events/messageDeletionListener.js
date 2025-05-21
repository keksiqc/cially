// Imports
const { Events } = require("discord.js");
const { debug } = require("../terminal/debug");
const { error } = require("../terminal/error");
const { sendPostRequest } = require("../http/postRequest");

// Event
module.exports = {
	name: Events.Raw,
	once: false,
	execute(packet) {
		// Removed unused client parameter
		if (packet.t !== "MESSAGE_DELETE") return;
		debug({ text: "Message Deleted. Fetching Guild..." });

		try {
			const guildID = packet.d.guild_id;
			debug({ text: `Fetched Guild. Message Deleted on Guild: ${guildID}` });

			const info = {
				guildID: guildID,
			};

			sendPostRequest({
				data: info,
				guildId: guildID,
				type: "messageDelete",
			});
		} catch (err) {
			error({ text: "Failed to save Message Deletion in the DB." });
			console.error(err); // Log the full error object
		}
	},
};
