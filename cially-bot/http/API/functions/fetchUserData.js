const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

async function fetchUserData(req, res, client) {
	const error_message = { code: "error" }; // success_message was unused
	const body = req.body;
	const guildID = req.params.guildID;
	const userId = body[0].userID;
	const channelID = body[0].channelID;

	const dataArray = [];

	debug({
		text: `User Data Fetching Request Received for Guild ID: ${guildID}, User ID: ${userId}, Channel ID: ${channelID}`,
	});

	try {
		const user = await client.users.fetch(userId);

		dataArray.push({
			username: user.username,
			globalName: user.globalName,
			avatar: user.displayAvatarURL(),
			creationDate: user.createdAt,
		});

		try {
			const discordChannel = await client.channels.fetch(channelID);

			dataArray.push({ channel: { id: channelID, name: discordChannel.name } });

			debug({ text: "User Data fetched. Ready to send response" }); // await removed

			res.send(dataArray); // await removed
		} catch (err) {
			error({
				// Changed to error log
				text: `Failed to fetch Channel Name for ID: ${channelID}. Error: ${err.message}`,
			});
			console.error(err); // Log the full error object
			// Sending partial data is an option, or send an error.
			// For now, let's assume partial data is acceptable if user data was fetched.
			dataArray.push({ channel: { id: channelID, name: channelID } });
			res.send(dataArray);
		}
	} catch (err) {
		error({
			// Changed to error log
			text: `Failed to fetch User Data for User ID: ${userId}. Error: ${err.message}`,
		});
		console.error(err); // Log the full error object
		res.status(500).json(error_message); // Send 500 on error
	}
}

module.exports = { fetchUserData };
