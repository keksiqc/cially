// Pocketbase Initialization variables were unused
// const url = process.env.POCKETBASE_URL;
// let collection_name = process.env.MESSAGE_COLLECTION; // Unused
// let guild_collection_name = process.env.GUILDS_COLLECTION; // Unused

// Main GET Event
export async function GET(request: Request) {
	// Removed unused params
	try {
		let API_REQ = await fetch(
			`${process.env.NEXT_PUBLIC_BOT_API_URL}/fetchGuilds`,
		);
		let data = await API_REQ.json();
		console.debug(data); // Changed to console.debug
		return Response.json({ data });
	} catch (err) {
		console.error("An error occured while trying to fetch data"); // Changed to console.error
		console.error(err); // Changed to console.error
		// Consider returning an error response
		return Response.json(
			{ error: "Failed to fetch guild data", details: err.message },
			{ status: 500 },
		);
	}
}
