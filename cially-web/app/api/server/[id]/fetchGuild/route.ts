import PocketBase from "pocketbase"; // describe import removed

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

const guild_collection_name = process.env.GUILDS_COLLECTION;
const message_collection_name = process.env.MESSAGE_COLLECTION;

// Main GET Event
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	try {
		const API_REQ = await fetch(
			`${process.env.NEXT_PUBLIC_BOT_API_URL}/syncGuild/${id}`,
		);
		const data = await API_REQ.json();
		const code = data.code;

		const today = new Date();
		const date = today.toISOString().slice(0, 10); // YYYY-MM-DD

		const yesterday = new Date(today);
		yesterday.setUTCDate(today.getUTCDate() - 1);
		const previous_date = yesterday.toISOString().slice(0, 10); // YYYY-MM-DD

		if (code === "success") {
			try {
				const guild = await pb
					.collection(guild_collection_name)
					.getFirstListItem(`discordID="${id}"`, {}); // Use quotes for string ID, exact match

				const today_msg_records = await pb
					.collection(message_collection_name)
					.getFullList({
						filter: `guildID = "${guild.id}" && created >= '${date} 00:00:00Z'`, // Exact match and full datetime
						sort: "created",
					});

				const yesterday_msg_records = await pb
					.collection(message_collection_name)
					.getFullList({
						filter: `guildID = "${guild.id}" && created >= '${previous_date} 00:00:00Z' && created < '${date} 00:00:00Z'`, // Exact match and full datetime range
						sort: "created",
					});

				const msg_day_difference =
					today_msg_records.length - yesterday_msg_records.length;

				const guildFound = [
					{
						discordID: guild.discordID,
						name: guild.name,
						members: guild.members,
						available: guild.available,
						discord_partner: guild.discord_partner,
						creation_date: guild.creation_date,
						channels: guild.channels,
						roles: guild.roles,
						bans: guild.bans,
						owner_username: guild.owner_username,
						icon_url: guild.icon_url,
						description: guild.description,
						vanity_url: guild.vanity_url,
						vanity_uses: guild.vanity_uses,
						today_msg: today_msg_records.length,
						msg_day_difference: msg_day_difference,
					},
				];
				return Response.json({ guildFound });
			} catch (dbErr) {
				console.error(`[ERROR] DB error in fetchGuild for ID ${id}:`, dbErr);
				const status = dbErr.status === 404 ? 404 : 500;
				return Response.json(
					{ errorCode: status, error: dbErr.message },
					{ status },
				);
			}
		} else {
			// This 'else' means the /syncGuild call itself did not return "success"
			console.warn(
				`[WARN] /syncGuild for ${id} did not return success. Code: ${code}`,
			);
			return Response.json(
				{ errorCode: 502, error: "Failed to sync guild with bot API." },
				{ status: 502 },
			);
		}
	} catch (fetchErr) {
		console.error(
			`[ERROR] Error fetching /syncGuild or processing its response for ID ${id}:`,
			fetchErr,
		);
		return Response.json(
			{ errorCode: 500, error: fetchErr.message },
			{ status: 500 },
		);
	}
}
