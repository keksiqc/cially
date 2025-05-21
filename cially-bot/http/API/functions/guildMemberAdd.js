const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const { pb } = require("../dbClient"); // Use shared pb instance
const collection_name = process.env.MEMBER_JOINS_COLLECTION;
const guild_collection_name = process.env.GUILD_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");

async function guildMemberAdd(req, res) {
	// client parameter removed
	// Parse the request body and debug it
	const body = req.body;

	const { guildID, memberID, memberCount } = body;

	debug({
		text: `New POST Request for guildMemberAdd: \n${JSON.stringify(body)}`,
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

		debug({ text: "Guild has been found and is ready to add data to it" });

		let isUnique = false;
		try {
			// Attempt to fetch an existing record for this member in this guild
			await pb.collection(collection_name).getFirstListItem(
				`memberID="${memberID}" && guildID="${guild.id}"`,
				{ requestKey: null }, // requestKey: null to prevent caching if not desired for this check
			);
			// If getFirstListItem succeeds, a record exists, so it's not unique for this context
			isUnique = false;
			debug({
				text: `Member ${memberID} already has a join record for guild ${guild.id}.`,
			});
		} catch (err) {
			if (err.status === 404) {
				// If a 404 error occurs, the record doesn't exist, so it's unique
				isUnique = true;
				debug({
					text: `Member ${memberID} has no prior join record for guild ${guild.id}. Considered unique.`,
				});
			} else {
				// Other errors (network, server error, etc.)
				error({
					text: `Error checking uniqueness for member ${memberID} in guild ${guild.id}.`,
				});
				console.error(err);
				// Default to not unique or handle error as appropriate, e.g., by not proceeding
				// For now, let's assume we can't confirm uniqueness, so proceed cautiously (treat as not unique)
				// or rethrow / return error response. For this example, we'll log and it will be treated as not unique.
			}
		}

		try {
			const itemData = {
				guildID: guild.id, // This is the PocketBase record ID of the guild
				memberID: `${memberID}`, // The Discord member ID
				unique: isUnique,
			};
			const newJoinRecord = await pb
				.collection(collection_name)
				.create(itemData);
			debug({ text: "Member Addition has been added in the database." });
		} catch (dbError) {
			error({ text: "Failed to create member addition entry in DB." });
			console.error(dbError);
		}
	} catch (err) {
		// 404 error -> guild is not on the database. Attempt to add it
		if (err.status === 404) {
			await registerGuild(guildID);
			// Still returns 201 below, assuming registerGuild handles its own errors and this is a "best effort"
		} else {
			error({
				text: `DB Error (guildMemberAdd - getFirstListItem for guild). Status: ${err.status}. Message: ${err.message}`,
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

module.exports = { guildMemberAdd };
