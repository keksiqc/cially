const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const { pb } = require("../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION;
const collection_name = process.env.MEMBER_LEAVES_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");

async function guildMemberRemove(req, res) {
	// client parameter removed
	const body = req.body;

	const { guildID, memberID, memberCount } = body;

	debug({
		text: `New POST Request for guildMemberRemove: \n${JSON.stringify(body)}`,
	});

	// Response to the request. Be kind and don't leave my boy Discord Bot on seen :)
	const roger = {
		response: `Message Received with the following details: GI: ${guildID}`,
	};

	// Database Logic
	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID="${guildID}"`, {}); // Standardized quotes
		debug({ text: "Guild has been found and is ready to add data to it" });

		let isUnique = false; // Default to not unique
		try {
			// Attempt to fetch an existing record for this member in this guild
			await pb.collection(collection_name).getFirstListItem(
				`memberID="${memberID}" && guildID="${guild.id}"`,
				{ requestKey: null }, // requestKey: null to prevent caching if not desired for this check
			);
			// If getFirstListItem succeeds, a record exists, so it's not unique for this context
			isUnique = false; // Explicitly false, though already default
			debug({
				text: `Member ${memberID} has a record in ${collection_name} for guild ${guild.id}.`,
			});
		} catch (err) {
			if (err.status === 404) {
				// If a 404 error occurs, the record doesn't exist.
				// For a "leave" event, "unique" might mean "was this their only recorded session?"
				// or "are there no other leave records?". The current logic sets unique=true if no prior record.
				// This interpretation of "unique" for a leave event might need business logic clarification.
				// Assuming "unique" means no prior leave record for this member in this guild.
				isUnique = true;
				debug({
					text: `Member ${memberID} has no prior leave record in ${collection_name} for guild ${guild.id}. Considered unique.`,
				});
			} else {
				// Other errors
				error({
					text: `Error checking uniqueness for member ${memberID} in ${collection_name} for guild ${guild.id}.`,
				});
				console.error(err);
			}
		}

		try {
			const itemData = {
				guildID: guild.id, // PocketBase record ID of the guild
				memberID: `${memberID}`, // Discord member ID
				unique: isUnique,
			};
			const newLeaveRecord = await pb
				.collection(collection_name)
				.create(itemData);
			debug({ text: "Member Removal has been added in the database." });
		} catch (dbError) {
			error({ text: "Failed to create member removal entry in DB." });
			console.error(dbError);
		}
	} catch (err) {
		// 404 error -> guild is not on the database. Attempt to add it
		if (err.status === 404) {
			await registerGuild(guildID);
			// Still returns 201 below, assuming registerGuild handles its own errors and this is a "best effort"
		} else {
			error({
				text: `DB Error (guildMemberRemove - getFirstListItem for guild). Status: ${err.status}. Message: ${err.message}`,
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

module.exports = { guildMemberRemove };
