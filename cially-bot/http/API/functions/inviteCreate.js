const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const { pb } = require("../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION;
const collection_name = process.env.INVITE_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");

async function inviteCreate(req, res) {
	// client parameter removed
	// Parse the request body and debug it
	const body = req.body;

	const { guildID, channelID, authorID } = body;

	debug({
		text: `New POST Request for inviteCreate: \n${JSON.stringify(body)}`,
	});

	// Response to the request. Be kind and don't leave my boy Discord Bot on seen :)
	const roger = {
		response: `Message Received with the following details: GI: ${guildID}`,
	};

	// Database Logic
	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID='${guildID}'`, {});
		debug({ text: " Guild has been found and is ready to add data to it" });

		try {
			const itemData = {
				guildID: guild.id,
				channelID: channelID,
				authorID: authorID,
			};
			const newInvite = await pb.collection(collection_name).create(itemData);
			debug({ text: " Invite has been added in the database" });
		} catch (dbError) {
			error({ text: "Failed to create invite entry in DB." });
			console.error(dbError);
		}
	} catch (err) {
		// 404 error -> guild is not on the database. Attempt to add it
		if (err.status === 404) {
			await registerGuild(guildID);
			// Still returns 201 below, assuming registerGuild handles its own errors and this is a "best effort"
		} else {
			error({
				text: `DB Error (inviteCreate - getFirstListItem for guild). Status: ${err.status}. Message: ${err.message}`,
			});
			console.error(err); // Log the full error object
			// If the primary guild lookup fails with something other than 404, it's a server-side issue.
			return res
				.status(500)
				.json({
					code: "error",
					message: "Failed to process guild information.",
				});
		}
	}

	debug({
		text: "End of logic. Stopping the communication and returning a response to the Bot",
	});

	return res.status(201).json(roger);
}

module.exports = { inviteCreate };
