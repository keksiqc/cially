import PocketBase from "pocketbase";
import registerGuild from "../../../_logic/registerGuild";

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

let collection_name = process.env.MESSAGE_COLLECTION;
let guild_collection_name = process.env.GUILDS_COLLECTION;

// Main GET Event
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	let fourWeeksAgoDate = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
	let fourWeeksAgoDate_formatted = `${fourWeeksAgoDate.getUTCFullYear()}-${(fourWeeksAgoDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${fourWeeksAgoDate.getUTCDate().toString().padStart(2, "0")}`;

	const { id } = await params;

	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID='${id}'`, {});

		try {
			let messagesArray = [];
			
			let todayDate = new Date();
			let todayDateUTC = new Date(
				Date.UTC(
					todayDate.getUTCFullYear(),
					todayDate.getUTCMonth(),
					todayDate.getUTCDate(),
				),
			);
			let todayDate_ms = todayDateUTC.getTime();

			const fourWeeksMessagesLog = await pb
				.collection(collection_name)
				.getFullList({
					filter: `guildID ?= "${guild.id}" && created>'${fourWeeksAgoDate_formatted}'`,
					sort: "created",
				});

			fourWeeksMessagesLog.forEach((message) => {
				let creation_date = String(message.created).slice(0, 19);
				let creation_date_js = new Date(
					Date.UTC(
						parseInt(creation_date.slice(0, 4)),
						parseInt(creation_date.slice(5, 7)) - 1,
						parseInt(creation_date.slice(8, 10)),
					),
				);
				let creation_date_js_ms = creation_date_js.getTime();

				messagesArray.push({
					message_id: message.id,
					author: message.author,
					channelID: `${message.channelID}`,
					created: creation_date_js_ms,
					created_formatted: creation_date,
				});
			});

			let monthlyMessages = [];
			let LastWeekDateUTC = new Date(
				Date.UTC(
					todayDate.getUTCFullYear(),
					todayDate.getUTCMonth() - 1,
					todayDate.getUTCDate(),
				),
			);

			
			

			let LastWeekDateUTC_ms = LastWeekDateUTC.getTime();

			messagesArray.forEach((message) => {
				if (message.created >= LastWeekDateUTC_ms) {
					monthlyMessages.push({
						message_id: message.id,
						author: message.author,
						channelID: `${message.channelID}`,
						created: message.created,
						created_formatted: message.created_formatted,
					});
				}
			});

			

			let activeChannels = [];

			monthlyMessages.forEach((message) => {
				let channel = message.channelID;
				let position = activeChannels.findIndex(
					(item) => item.channel === channel,
				);
				if (position !== -1) {
					activeChannels[position].amount = activeChannels[position].amount + 1;
				} else {
					activeChannels.push({ channel: channel, amount: 1 });
				}
			});
			activeChannels.sort((a, b) => b.amount - a.amount);
			activeChannels = activeChannels.slice(0, 5);

			let activeUsers = [];

			monthlyMessages.forEach((message) => {
				let messageAuthor = message.author;
				let position = activeUsers.findIndex(
					(item) => item.author === messageAuthor,
				);
				if (position !== -1) {
					activeUsers[position].amount = activeUsers[position].amount + 1;
				} else {
					activeUsers.push({ author: messageAuthor, amount: 1 });
				}
			});
			activeUsers.sort((a, b) => b.amount - a.amount);
			activeUsers = activeUsers.slice(0, 5);

			let activeHourData = [];

			let o = 0;

			while (o < 25) {
				if (o < 10) {
					activeHourData.push({ hour: `0${o}`, amount: 0 });
				} else {
					activeHourData.push({ hour: `${o}`, amount: 0 });
				}
				o = o + 1;
			}

			monthlyMessages.forEach((record) => {
				let minutes = [record.created_formatted.slice(11, 13)];
				minutes.forEach((minute) => {
					let position = activeHourData.findIndex(
						(item) => item.hour === minute,
					);
					if (position !== -1) {
						activeHourData[position].amount =
							activeHourData[position].amount + 1;
					} else {
						activeHourData.push({ hour: minute, amount: 1 });
					}
				});
			});
			activeHourData.sort((a, b) => a.hour - b.hour);

			let discordDataOUT = [{ channels: [], users: [] }];
			activeChannels.forEach((item) => {
				discordDataOUT[0].channels.push(item.channel);
			});
			activeUsers.forEach((item) => {
				discordDataOUT[0].users.push(item.author);
			});

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
				discordDataIN.newChannels.forEach((channel) => {
					channelMap[channel.id] = channel.name;
				});
			}

			if (discordDataIN.newUsers && discordDataIN.newUsers.length > 0) {
				discordDataIN.newUsers.forEach((user) => {
					userMap[user.id] = user.name;
				});
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

			let generalData = [{online: guild.online, idle: guild.idle, offline: guild.offline, total: guild.members}]



			let finalData = [];
			finalData.push({
				ChannelData: activeChannels,
				ActiveUsersData: activeUsers,
				ActiveHourData: activeHourData,
				ID: discordDataIN,
				GeneralData: generalData
				
			});

			return Response.json({ finalData });
		} catch (err) {
			let notFound = [{ errorCode: 404 }];
			console.log(err);
			return Response.json({ notFound });
		}
	} catch (err) {
		if (err.status === 400) {
			let notFound = [{ errorCode: 404 }];
			return Response.json({ notFound });
		}
	}
}
