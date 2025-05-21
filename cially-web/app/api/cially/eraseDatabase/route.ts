import PocketBase from "pocketbase";

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

// Main GET Event
export async function DELETE(request: Request) {
	// Removed unused params
	async function deleteAllFromCollection(collectionName: string) {
		const records = await pb.collection(collectionName).getFullList(); // loads all records
		await Promise.all(
			records.map((record) => pb.collection(collectionName).delete(record.id)),
		);
	}

	try {
		// Deletes data in the "guilds" collection so all the data loses their guild relation
		// Saves time & data instead of clearing every single collection
		const guildCollection = process.env.GUILDS_COLLECTION || "guilds"; // Use env var, fallback to "guilds"
		await deleteAllFromCollection(guildCollection);
		return Response.json({ code: "Success" }, { status: 200 });
	} catch (err) {
		console.error("[ERROR] Failed to erase database:", err); // Added error logging
		return Response.json(
			{ code: "Error", message: err.message },
			{ status: 500 },
		);
	}
}
