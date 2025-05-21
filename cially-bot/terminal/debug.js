const colors = require("colors"); // Explicitly require colors

// process.env.DEBUGGING should be available globally after index.js setup
const debugging_status = process.env.DEBUGGING;

// Simple Script to display prettier terminal messages
function debug({ text, type }) {
	// Added type for potential SUCCESS messages
	if (debugging_status === "TRUE") {
		if (type === "SUCCESS") {
			console.log(`${colors.green("\n[SUCCESS]")} ${text}`);
		} else {
			console.log(`${colors.yellow("\n[DEBUG]")} ${text}`);
		}
	}
}

module.exports = { debug };
