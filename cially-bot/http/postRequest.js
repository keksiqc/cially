// Imports
const { debug } = require("../terminal/debug");
const { error } = require("../terminal/error");
const get = require("simple-get");

// API URL Initialization
const API_URL = process.env.API_URL;

// Main Event
function sendPostRequest({ data, guildId, type }) {
	try {
		// Send a debug message on attempt
		debug({ text: "HTTP Request sent" });

		// Load request options through event parameters
		const opts = {
			url: `${API_URL}/${type}/${guildId}/`,
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		};

		// HTTP Request
		get.post(opts, (postErr, res) => {
			// Renamed err to postErr to avoid conflict
			if (postErr) {
				error({
					text: `HTTP POST request failed before response from ${opts.url}`,
				});
				console.error(postErr);
				return;
			}

			// The res object might be undefined if the request itself failed (e.g., DNS resolution, connection refused)
			// simple-get calls the callback with (err, res). If err is present, res might be undefined.
			if (!res) {
				error({
					text: `No response object received for POST request to ${opts.url}. Original error: ${postErr ? postErr.message : "Unknown error"}`,
				});
				return;
			}

			let responseBody = "";
			res.on("data", (chunk) => {
				responseBody += chunk;
			});

			res.on("end", () => {
				debug({
					text: `Response received from ${opts.url}. Status: ${res.statusCode}. Body: ${responseBody}`,
				});
				// Depending on expected response, parse responseBody (e.g., JSON.parse) or check status code
			});

			res.on("error", (responseErr) => {
				// Added error handler for the response stream itself
				error({ text: `Error during response stream from ${opts.url}` });
				console.error(responseErr);
			});
		});
	} catch (err) {
		// This catch block handles errors during the setup of the request (e.g., opts construction)
		error({ text: "Failed to initiate HTTP POST request." });
		console.error(err);
	}
}

// Export Event
module.exports = { sendPostRequest };
