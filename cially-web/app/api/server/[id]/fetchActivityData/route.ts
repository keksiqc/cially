import PocketBase from "pocketbase";

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

const collection_name = process.env.MESSAGE_COLLECTION;
const guild_collection_name = process.env.GUILDS_COLLECTION;

// Main GET Event
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const threeWeeksAgo = new Date(); // Renamed for clarity regarding "last 4 weeks" behavior
	threeWeeksAgo.setUTCDate(threeWeeksAgo.getUTCDate() - 21);
	const threeWeeksAgoDate_formatted = threeWeeksAgo.toISOString().slice(0, 10); // YYYY-MM-DD

	const { id } = await params;

	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID="${id}"`, {}); // Use quotes for string ID, exact match

		try {
			const messagesArray = [];

			const todayDate = new Date();
			const todayDateUTC = new Date(
				Date.UTC(
					todayDate.getUTCFullYear(),
					todayDate.getUTCMonth(),
					todayDate.getUTCDate(),
				),
			);
			const todayDate_ms = todayDateUTC.getTime();

			const fourWeeksMessagesLog = await pb
				.collection(collection_name)
				.getFullList({
					filter: `guildID = "${guild.id}" && created >= '${threeWeeksAgoDate_formatted} 00:00:00Z'`, // Exact match for guildID, and use full datetime for created
					sort: "created",
				});

			for (const message of fourWeeksMessagesLog) {
				const creation_date = String(message.created).slice(0, 19);
				const creation_date_js = new Date(
					Date.UTC(
						parseInt(creation_date.slice(0, 4)),
						parseInt(creation_date.slice(5, 7)) - 1,
						parseInt(creation_date.slice(8, 10)),
					),
				);
				const creation_date_js_ms = creation_date_js.getTime();

				messagesArray.push({
					message_id: message.id,
					author: message.author,
					channelID: `${message.channelID}`,
					created: creation_date_js_ms,
					created_formatted: creation_date,
				});
			}

			const monthlyMessages = [];
			const LastWeekDateUTC = new Date(
				Date.UTC(
					todayDate.getUTCFullYear(),
					todayDate.getUTCMonth() - 1,
					todayDate.getUTCDate(),
				),
			);

			const LastWeekDateUTC_ms = LastWeekDateUTC.getTime();

			for (const message of messagesArray) {
				if (message.created >= LastWeekDateUTC_ms) {
					monthlyMessages.push({
						message_id: message.id,
						author: message.author,
						channelID: `${message.channelID}`,
						created: message.created,
						created_formatted: message.created_formatted,
					});
				}
			}

			let activeChannels = [];

			for (const message of monthlyMessages) {
				const channel = message.channelID;
				const position = activeChannels.findIndex(
					(item) => item.channel === channel,
				);
				if (position !== -1) {
					activeChannels[position].amount = activeChannels[position].amount + 1;
				} else {
					activeChannels.push({ channel: channel, amount: 1 });
				}
			}
			activeChannels.sort((a, b) => b.amount - a.amount);
			activeChannels = activeChannels.slice(0, 5);

			let activeUsers = [];

			for (const message of monthlyMessages) {
				const messageAuthor = message.author;
				const position = activeUsers.findIndex(
					(item) => item.author === messageAuthor,
				);
				if (position !== -1) {
					activeUsers[position].amount = activeUsers[position].amount + 1;
				} else {
					activeUsers.push({ author: messageAuthor, amount: 1 });
				}
			}
			activeUsers.sort((a, b) => b.amount - a.amount);
			activeUsers = activeUsers.slice(0, 5);

			const activeHourData = [];

			let o = 0;

			while (o < 25) {
				if (o < 10) {
					activeHourData.push({ hour: `0${o}`, amount: 0 });
				} else {
					activeHourData.push({ hour: `${o}`, amount: 0 });
				}
				o++; // Changed to o++
			}

			for (const record of monthlyMessages) {
				const minutes = [record.created_formatted.slice(11, 13)];
				for (const minute of minutes) {
					const position = activeHourData.findIndex(
						(item) => item.hour === minute,
					);
					if (position !== -1) {
						activeHourData[position].amount =
							activeHourData[position].amount + 1;
					} else {
						activeHourData.push({ hour: minute, amount: 1 });
					}
				}
			}
			activeHourData.sort((a, b) => a.hour - b.hour);

			const discordDataOUT = [{ channels: [], users: [] }];
			for (const item of activeChannels) {
				discordDataOUT[0].channels.push(item.channel);
			}
			for (const item of activeUsers) {
				discordDataOUT[0].users.push(item.author);
			}

			const discordDataIN_Req = await fetch(
				`${process.env.NEXT_PUBLIC_BOT_API_URL}/fetchID/${guild.discordID}`,
				{
					body: JSON.stringify(discordDataOUT),
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
				},
			);
			const discordDataIN = await discordDataIN_Req.json();

			const channelMap = {};
			const userMap = {};

			if (discordDataIN.newChannels && discordDataIN.newChannels.length > 0) {
				for (const channel of discordDataIN.newChannels) {
					channelMap[channel.id] = channel.name;
				}
			}

			if (discordDataIN.newUsers && discordDataIN.newUsers.length > 0) {
				for (const user of discordDataIN.newUsers) {
					userMap[user.id] = user.name;
				}
			}

			activeChannels = activeChannels.map((channel) => {
				return {
					channel: channelMap[channel.channel] || channel.channel,
					originalId: channel.channel,
					amount: channel.amount,
				};
			});

			activeUsers = activeUsers.map((user) => {
				return {
					author: userMap[user.author] || user.author,
					originalId: user.author,
					amount: user.amount,
				};
			});

			const generalData = [
				{
					online: guild.online,
					idle: guild.idle,
					offline: guild.offline,
					total: guild.members,
				},
			];

			const finalData = [];
			finalData.push({
				ChannelData: activeChannels,
				ActiveUsersData: activeUsers,
				ActiveHourData: activeHourData,
				ID: discordDataIN,
				GeneralData: generalData[0], // Return object directly
			});
			// Return object directly, not in an array:
			// return Response.json(finalData[0]);
			// For now, to minimize changes to client-side parsing if it expects finalData: [{...}]
			return Response.json({ finalData });
		} catch (err) {
			console.error("[ERROR] Fetching activity data details:", err); // Changed to console.error
			return Response.json(
				{ errorCode: 404, error: err.message },
				{ status: 404 },
			);
		}
	} catch (err) {
		console.error("[ERROR] Fetching guild for activity data:", err); // Changed to console.error
		const status = err.status === 404 ? 404 : 500; // Differentiate 404 for guild
		return Response.json({ errorCode: status, error: err.message }, { status });
	}
}
