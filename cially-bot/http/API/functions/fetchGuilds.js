const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const { pb } = require("../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION;

async function fetchGuilds(req, res, client) {
	const error_message = { code: "error" }; // success_message was unused
	debug({ text: "Server Fetching Request Received" });

	try {
		const guilds_in_database = [];
		const guilds = await pb.collection(guild_collection_name).getFullList({});
		for (const guild of guilds) {
			guilds_in_database.push(guild.discordID);
		}

		try {
			const discord_guilds_cache = client.guilds.cache;
			const guildsArray = [];
			for (const [, guild] of discord_guilds_cache) {
				// Iterate directly over cache
				const icon = await guild.iconURL();
				if (guilds_in_database.includes(guild.id)) {
					guildsArray.push({
						// Removed await
						name: guild.name,
						id: guild.id,
						icon: icon,
						in_db: true,
					});
				} else {
					guildsArray.push({
						// Removed await
						name: guild.name,
						id: guild.id,
						icon: icon,
						in_db: false,
					});
				}
			}

			// Do not remove this line bellow cause things will brake for some reason
			await debug({ text: "Completed Fetching Available Guilds" });

			res.send({ AvailableGuilds: guildsArray });
		} catch (err) {
			error({
				text: "Failed to communicate with the Discord API. /fetchGuilds",
			});
			console.error(err); // Log full error object
			res.status(500).json(error_message); // Send 500 on error
		}
	} catch (err) {
		error({
			text: "Failed to communicate with the PocketBase Instance. /fetchGuilds",
		});
		console.error(err); // Log full error object
		// Determine if it's a 404 for the guild itself, though getFullList might not cause this directly for the main guild.
		// For now, assume 500 for any DB error at this level.
		res.status(500).json(error_message); // Send 500 on error
	}
}

module.exports = { fetchGuilds };
