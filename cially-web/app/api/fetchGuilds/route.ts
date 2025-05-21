// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;

let collection_name = process.env.MESSAGE_COLLECTION;
let guild_collection_name = process.env.GUILDS_COLLECTION;

// Main GET Event
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		let API_REQ = await fetch(
			`${process.env.NEXT_PUBLIC_BOT_API_URL}/fetchGuilds`,
		);
		let data = await API_REQ.json();
		console.log(data);
		return Response.json({ data });
	} catch (err) {
		console.log("An error occured while trying to fetch data");
		console.log(err);
	}
}
