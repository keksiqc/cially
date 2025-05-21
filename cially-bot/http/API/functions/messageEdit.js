const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const { pb } = require("../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");

async function messageEdit(req, res) {
	// client parameter removed
	const body = req.body;
	const { guildID } = body;

	debug({ text: `New POST req for messageEdit: \n${JSON.stringify(body)}` });

	const roger = {
		res: `Message Edit Received with the following details: GI: ${guildID}`,
	};

	// Database Logic
	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID='${guildID}'`, {});
		debug({ text: "Guild has been found and is ready to add data to it" });

		const new_general_data = {
			message_edits: guild.message_edits + 1,
		};

		const newGeneralData = await pb
			.collection(`${guild_collection_name}`)
			.update(`${guild.id}`, new_general_data);
		debug({
			text: "General Guild Data has been updated in the database",
		});
	} catch (err) {
		// 404 error -> guild is not on the database. Attempt to add it
		if (err.status === 404) {
			await registerGuild(guildID);
			// Still returns 201 below, assuming registerGuild handles its own errors.
		} else {
			error({
				text: `DB Error (messageEdit - getFirstListItem for guild). Status: ${err.status}. Message: ${err.message}`,
			});
			console.error(err); // Log the full error object
			return res
				.status(500)
				.json({
					code: "error",
					message: "Failed to process guild information for message edit.",
				});
		}
	}

	debug({
		text: "End of logic. Stopping the communication and returning a res to the Bot",
	});

	// Express response
	return res.status(201).json(roger);
}

module.exports = { messageEdit };
