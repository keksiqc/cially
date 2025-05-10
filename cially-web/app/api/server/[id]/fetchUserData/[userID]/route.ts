import { describe } from "node:test";
import PocketBase from "pocketbase";

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

let guild_collection_name = process.env.GUILDS_COLLECTION;
let message_collection_name = process.env.MESSAGE_COLLECTION;

// Main GET Event
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string, userID: string }> },
) {
    const { id, userID } = await params;
    return Response.json({id, userID})
}