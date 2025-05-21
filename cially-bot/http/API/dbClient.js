const PocketBase = require("pocketbase/cjs");
const url = process.env.POCKETBASE_URL;

if (!url) {
	console.error(
		"[ERROR] PocketBase URL is not defined. Please check your .env file.",
	);
	// Depending on desired behavior, you might want to throw an error here
	// or allow the app to continue running in a degraded state if pb is not critical everywhere.
}

const pb = new PocketBase(url);

// Global settings for the pb instance, if any (e.g., autoCancellation)
pb.autoCancellation(false); // Moved from messageCreate.js

module.exports = { pb };
