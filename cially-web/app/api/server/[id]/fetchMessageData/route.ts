import PocketBase from "pocketbase";
import { hourData } from "./_lazy-import/hourdata";

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
	const threeWeeksAgo = new Date();
	threeWeeksAgo.setUTCDate(threeWeeksAgo.getUTCDate() - 21);
	const threeWeeksAgoDate_formatted = threeWeeksAgo.toISOString().slice(0, 10); // YYYY-MM-DD for >= filter

	const { id } = await params;

	try {
		const guild = await pb
			.collection(guild_collection_name)
			.getFirstListItem(`discordID="${id}"`, {}); // Use quotes for string ID, exact match

		try {
			const messagesArray = [];

			const fourWeeksMessagesLog = await pb
				.collection(collection_name)
				.getFullList({
					filter: `guildID = "${guild.id}" && created >= '${threeWeeksAgoDate_formatted} 00:00:00Z'`, // Exact match for guildID
					sort: "created",
				});

			for (const message of fourWeeksMessagesLog) {
				const creationDate = new Date(message.created); // PocketBase dates are usually ISO strings
				messagesArray.push({
					message_id: message.id,
					author: message.author,
					channelID: `${message.channelID}`,
					created: creationDate.getTime(), // Store as timestamp
					created_formatted: message.created, // Keep original ISO string for hour/date part extraction
				});
			}

			const today = new Date();
			const startOfToday_ms = Date.UTC(
				today.getUTCFullYear(),
				today.getUTCMonth(),
				today.getUTCDate(),
			);
			const endOfToday_ms = startOfToday_ms + 24 * 60 * 60 * 1000 - 1; // End of today UTC

			const todayMessages = messagesArray.filter(
				(message) =>
					message.created >= startOfToday_ms &&
					message.created <= endOfToday_ms,
			);

			// Initialize hourData locally
			const localHourData = Array.from({ length: 24 }, (_, i) => ({
				hour: i.toString().padStart(2, "0"),
				amount: 0,
			}));

			for (const record of todayMessages) {
				const hour = new Date(record.created_formatted)
					.getUTCHours()
					.toString()
					.padStart(2, "0");
				const position = localHourData.findIndex((item) => item.hour === hour);
				if (position !== -1) {
					localHourData[position].amount++;
				}
				// No else needed if all hours 00-23 are pre-initialized
			}
			// localHourData is already sorted by hour due to initialization.

			const oneMonthAgo = new Date();
			oneMonthAgo.setUTCMonth(oneMonthAgo.getUTCMonth() - 1);
			const oneMonthAgo_ms = oneMonthAgo.getTime();

			const monthlyMessages = messagesArray.filter(
				(message) => message.created >= oneMonthAgo_ms,
			);

			let weekData = [];
			for (let u = 0; u < 7; u++) {
				// Corrected loop for last 7 days (0-6)
				const uDaysAgoDate = new Date();
				uDaysAgoDate.setUTCDate(today.getUTCDate() - u);
				const uDaysAgoDate_formatted = `${(uDaysAgoDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${uDaysAgoDate.getUTCDate().toString().padStart(2, "0")}`;
				weekData.push({ date: uDaysAgoDate_formatted, amount: 0 });
			}

			for (const record of monthlyMessages) {
				// Should filter for last 7 days of messages for weekData
				const messageDate = new Date(record.created);
				const messageDate_formatted = `${(messageDate.getUTCMonth() + 1).toString().padStart(2, "0")}-${messageDate.getUTCDate().toString().padStart(2, "0")}`;
				const position = weekData.findIndex(
					(item) => item.date === messageDate_formatted,
				);
				if (position !== -1) {
					weekData[position].amount++;
				}
			}
			weekData = weekData.reverse(); // To have oldest to newest

			// console.log("oioioi"); // Removed

			let fourWeekData = [];
			for (let w = 0; w < 4; w++) {
				// Iterate 4 times for 4 weeks
				const weekStartDate = new Date();
				weekStartDate.setUTCDate(today.getUTCDate() - w * 7 - 6); // Start of the week (e.g., Sunday/Monday)
				weekStartDate.setUTCHours(0, 0, 0, 0);

				const weekEndDate = new Date();
				weekEndDate.setUTCDate(today.getUTCDate() - w * 7);
				weekEndDate.setUTCHours(23, 59, 59, 999);

				const weekStart_ms = weekStartDate.getTime();
				const weekEnd_ms = weekEndDate.getTime();

				const weekFactor = weekStartDate.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				});

				fourWeekData.push({
					factor: weekFactor,
					starting_date_ms: weekStart_ms,
					finishing_date_ms: weekEnd_ms,
					amount: 0,
				});
			}
			fourWeekData.reverse(); // Oldest week first

			for (const record of monthlyMessages) {
				// Use all messages from last month for this
				const position = fourWeekData.findIndex(
					(item) =>
						record.created >= item.starting_date_ms &&
						record.created <= item.finishing_date_ms,
				);
				if (position !== -1) {
					fourWeekData[position].amount++;
				}
				// Removed 'else { return; }' as it was incorrect logic
			}
			// fourWeekData = fourWeekData.toReversed(); // Already reversed for oldest first

			const generalDataArray = {
				// Changed to object
				total_messages: guild.total_messages,
				message_deletions: guild.message_deletions,
				message_edits: guild.message_edits,
				total_attachments: guild.total_attachments,
			};

			const finalData = {
				// Changed to object
				HourData: localHourData, // Use localHourData
				WeekData: weekData,
				FourWeekData: fourWeekData,
				GeneralData: generalDataArray,
			};

			return Response.json(finalData); // Return the object directly
		} catch (err) {
			console.error("[ERROR] Fetching message data details:", err);
			return Response.json(
				{ errorCode: 404, error: err.message },
				{ status: 404 },
			);
		}
	} catch (err) {
		console.error("[ERROR] Fetching guild for message data:", err);
		const status = err.status === 404 ? 404 : 500;
		return Response.json({ errorCode: status, error: err.message }, { status });
	}
}
