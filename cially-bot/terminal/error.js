const colors = require("colors"); // Explicitly require colors

// Simple Script to display prettier terminal messages
function error({ text }) {
	console.log(`${colors.red("\n[ERROR]")} ${text}`);
}

module.exports = { error };
