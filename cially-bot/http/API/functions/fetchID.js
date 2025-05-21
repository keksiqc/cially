const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

async function fetchID(req, res, client) {
	const error_message = { code: "error" }; // success_message was unused
	const body = req.body;
	const guildID = req.params.guildID;

	debug({ text: `ID Fetching Request Received for Guild ID: ${guildID}` });

	try {
		const channels = body[0].channels;
		const users = body[0].users;
		const newArray = { newChannels: [], newUsers: [] };
		// const guild = client.guilds.cache.get(`${String(guildID)}`); // guild variable was unused

		for (const channel of channels) {
			try {
				const discordChannel = await client.channels.fetch(channel);
				newArray.newChannels.push({
					id: channel,
					name: `${discordChannel.name}`,
				});
				debug({ text: `Added Succesfully Channel: ${channel}` });
			} catch (err) {
				debug({ text: `Failed to add Channel: ${channel}` });
			}
		}

		for (const user of users) {
			try {
				const discordUser = client.users.cache.get(user);
				newArray.newUsers.push({ id: user, name: discordUser.username });
				debug({ text: `Added Succesfully User: ${user}` });
			} catch (err) {
				debug({ text: `Failed to add User: ${user}` });
			}
		}

		// The previous `await debug` line was not essential for stability with the current for...of loops.
		// The for...of loops with `await` inside correctly handle async operations.
		debug({ text: "IDs fetched. Ready to send response" }); // await removed from debug

		res.send(newArray); // await removed from res.send
	} catch (err) {
		error({
			text: `Failed to communicate with the Discord API. /fetchID${guildID}`,
		});
		console.error(err); // Log full error object
		res.status(500).json(error_message); // Send 500 on error
	}
}

module.exports = { fetchID };
