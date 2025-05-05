import PocketBase from "pocketbase";
import { hourData } from "./_lazy-import/hourdata";

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

	let start_perf = performance.now();

	let fourWeeksAgoDate = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000);
	let fourWeeksAgoDate_formatted = `${fourWeeksAgoDate.getUTCFullYear()}-${(fourWeeksAgoDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${fourWeeksAgoDate.getUTCDate().toString().padStart(2, "0")}`;

	const { id } = await params;

	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID='${id}'`, {});

		try {
			let messagesArray = [];

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

			let todayMessages = [];
			let todayDate = new Date();
			let todayDateUTC = new Date(
				Date.UTC(
					todayDate.getUTCFullYear(),
					todayDate.getUTCMonth(),
					todayDate.getUTCDate(),
				),
			);
			let todayDate_ms = todayDateUTC.getTime();

			messagesArray.forEach((message) => {
				if (message.created === todayDate_ms) {
					todayMessages.push({
						message_id: message.id,
						author: message.author,
						channelID: `${message.channelID}`,
						created: message.created,
						created_formatted: message.created_formatted,
					});
				}
			});

			todayMessages.forEach((record) => {
				let minutes = [record.created_formatted.slice(11, 13)];
				minutes.forEach((minute) => {
					let position = hourData.findIndex((item) => item.hour === minute);
					if (position !== -1) {
						hourData[position].amount = hourData[position].amount + 1;
					} else {
						hourData.push({ hour: minute, amount: 1 });
					}
				});
			});
			hourData.sort((a, b) => a.hour - b.hour);

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

			let weekData = [];

			let u = 0;

			while (u < 8) {
				let uDaysAgoDate = new Date(Date.now() - u * 24 * 60 * 60 * 1000);
				let uDaysAgoDate_formatted = `${(uDaysAgoDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${uDaysAgoDate.getUTCDate().toString().padStart(2, "0")}`;
				weekData.push({ date: `${uDaysAgoDate_formatted}`, amount: 0 });
				u = u + 1;
			}

			monthlyMessages.forEach((record) => {
				let monthly_msg = [record.created_formatted.slice(5, 10)];
				monthly_msg.forEach((monthly_msg) => {
					let position = weekData.findIndex(
						(item) => item.date === monthly_msg,
					);
					if (position !== -1) {
						weekData[position].amount = weekData[position].amount + 1;
					} else {
						return;
					}
				});
			});
			weekData = weekData.toReversed();

			let fourWeekData = [];

			let w = 0;
			while (w < 22) {
				let startingDate = new Date(Date.now() - w * 24 * 60 * 60 * 1000);
				let startingDate_formatted = `${startingDate.getUTCFullYear().toString().padStart(2, "0")}-${(startingDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${startingDate.getUTCDate().toString().padStart(2, "0")}`;
				let startingDate_ms = startingDate.getTime();
				let startingDate_factor = startingDate.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				let endingDate = new Date(Date.now() - (7 + w) * 24 * 60 * 60 * 1000);
				let endingDate_formatted = `${endingDate.getUTCFullYear().toString().padStart(2, "0")}-${(endingDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${endingDate.getUTCDate().toString().padStart(2, "0")}`;
				let endingDate_ms = endingDate.getTime();

				fourWeekData.push({
					factor: `${startingDate_factor}`,
					starting_date: { startingDate_formatted, startingDate_ms },
					finishing_date: { endingDate_formatted, endingDate_ms },
					amount: 0,
				});
				w = w + 7;
			}

			monthlyMessages.forEach((record) => {
				let creation_date = new Date(record.created_formatted.slice(0, 10));
				let creation_date_ms = creation_date.getTime();
				let position = fourWeekData.findIndex(
					(item) =>
						item.starting_date.startingDate_ms >= creation_date_ms &&
						item.finishing_date.endingDate_ms <= creation_date_ms,
				);
				if (position !== -1) {
					fourWeekData[position].amount = fourWeekData[position].amount + 1;
				} else {
					return;
				}
			});
			fourWeekData = fourWeekData.toReversed();

			let generalDataArray = []
			generalDataArray.push({
				total_messages: guild.total_messages,
				message_deletions: guild.message_deletions,
				message_edits: guild.message_edits,
				total_attachments: guild.total_attachments,

			})


			let finalData = [];
			finalData.push({
				HourData: hourData,
				WeekData: weekData,
				FourWeekData: fourWeekData,
				GeneralData: generalDataArray,
			});

			let end_perf = performance.now();

			console.log((end_perf - start_perf) + ' s')

			return Response.json({ finalData });

		} catch (err) {
			let notFound = [{ errorCode: 404 }];
			return Response.json({ notFound });
			console.log(err);
		}
	} catch (err) {
		if (err.status === 400) {
			let notFound = [{ errorCode: 404 }];
			return Response.json({ notFound });
		}
	}
}
