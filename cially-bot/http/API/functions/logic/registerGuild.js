// Imports
// PocketBase client is now shared
const { pb } = require("../../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION;
const get = require("simple-get");
const { debug } = require("../../../../terminal/debug");
const { error } = require("../../../../terminal/error");
const API_URL = process.env.API_URL;

async function registerGuild(guildID) {
	debug({ text: "Guild is not in the database. Attempting to add it..." });

	const guildData = { discordID: guildID };
	try {
		const newGuild = await pb
			.collection(guild_collection_name)
			.create(guildData);
		debug({ text: "Guild has been added to the database" });

		try {
			// Load request options through event parameters
			const opts = {
				url: `${API_URL}/syncGuild/${guildID}/`,
			};

			// HTTP Request
			get.get(opts, (requestErr, response) => {
				// Renamed err to requestErr, res to response
				if (requestErr) {
					error({ text: `Failed to GET ${opts.url}.` });
					console.error(requestErr);
					return;
				}
				// res.pipe(process.stdout) removed. If response data is needed, it should be handled here.
				debug({
					text: `Response received from /syncGuild call. Status: ${response.statusCode}`,
				});
				// response.on("data", (chunk) => { ... }); // If response data needs to be processed
				response.on("error", (responseErr) => {
					error({ text: `Error during response stream from ${opts.url}` });
					console.error(responseErr);
				});
			});
		} catch (requestSetupErr) {
			// This catch block handles errors during the setup of the request (e.g., opts construction)
			error({ text: "Failed to initiate GET request for /syncGuild." });
			console.error(requestSetupErr);
		}
	} catch (dbCreateError) {
		error({ text: "Failed to create new guild in DB." });
		console.error(dbCreateError);
	}
}

module.exports = { registerGuild };
