const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const PocketBase = require("pocketbase/cjs");
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);
const guild_collection_name = process.env.GUILD_COLLECTION;
const collection_name = process.env.MESSAGE_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");
const { retryRequest } = require("./logic/retryRequest");

// Disabled Auto Cancellation
pb.autoCancellation(false);

async function messageCreate(req, res) {
	// client parameter removed
	const body = req.body;
	const {
		guildID,
		messageID,
		messageLength,
		channelID,
		authorID,
		attachments,
	} = body;

	debug({ text: `New POST req: \n${JSON.stringify(body)}` });

	const roger = {
		res: `Message Received with the following details: GI: ${guildID}, MI: ${messageID}`,
	};

	try {
		const guild = await retryRequest(() =>
			pb
				.collection(guild_collection_name)
				.getFirstListItem(`discordID='${guildID}'`, {}),
		);

		debug({ text: "Guild has been found and is ready to add data to it" });

		debug({
			text: "Guild Data Item has been found and is ready to add data to it",
		});

		const itemData = {
			author: authorID,
			guildID: guild.id,
			channelID: channelID,
			messageLength: messageLength,
		};

		const newMessage = await retryRequest(() =>
			pb.collection(collection_name).create(itemData),
		);

		debug({
			text: `Message has been added in the database. ID: ${messageID}`,
		});

		const new_general_data = {
			total_messages: guild.total_messages + 1,
			total_attachments: guild.total_attachments + attachments,
		};

		await retryRequest(() =>
			pb.collection(guild_collection_name).update(guild.id, new_general_data),
		);

		debug({
			text: "General Guild Data has been updated in the database",
		});
	} catch (err) {
		if (err.status === 404) {
			await registerGuild(guildID);
			// If registerGuild is called, it implies the primary guild lookup failed with 404.
			// The current flow will still attempt to return 201 below.
			// This is acceptable if messageCreate is best-effort after attempting registration.
		} else {
			// This means retryRequest failed for getFirstListItem or subsequent updates
			error({
				text: `DB Error (messageCreate). Status: ${err.status || "Unknown"}. Message: ${err.message}`,
			});
			console.error(err); // Log the full error object
			// If any critical DB operation (fetch, create, update) ultimately fails after retries
			return res
				.status(500)
				.json({
					code: "error",
					message: "Failed to process message and update guild data.",
				});
		}
	}

	debug({
		text: "End of logic. Stopping the communication and returning a res to the Bot",
	});

	return res.status(201).json(roger);
}

module.exports = { messageCreate };
