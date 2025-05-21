// Imports
import PocketBase from "pocketbase";

// Initialize Pocketbase URL
const url = process.env.POCKETBASE_URL;

// Pocketbase Initialization
const pb = new PocketBase(url);
const guild_collection_name = process.env.GUILDS_COLLECTION; // Changed to const

export default async function registerGuild(guildID) {
	console.debug(
		"[DEBUG] Guild is not in the database. Attempting to add it...",
	); // Changed to console.debug
	const guildData = { discordID: guildID };
	try {
		const newGuild = await pb
			.collection(guild_collection_name)
			.create(guildData);
		console.debug("[DEBUG] Guild has been added to the database"); // Changed to console.debug
		fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL}/syncGuild/${guildID}`).catch(
			(err) =>
				console.error(
					`[ERROR] Failed to trigger /syncGuild for ${guildID}:`,
					err,
				),
		); // Added catch for fetch
	} catch (error) {
		console.error(
			`[ERROR] Failed to create new guild ${guildID} in DB:`,
			error,
		); // Changed to console.error
	}
}
