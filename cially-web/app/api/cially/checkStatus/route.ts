import { describe } from "node:test";
import PocketBase from "pocketbase";

// Pocketbase Initialization
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);

let guild_collection_name = process.env.GUILDS_COLLECTION;
let message_collection_name = process.env.MESSAGE_COLLECTION;

import fetch from 'node-fetch';

// Main GET Event
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {

  try {

    let final_status = []

    const controller_pb = new AbortController();
    const controller_bot = new AbortController();
    const timeoutId_pb = setTimeout(() => controller_pb.abort(), 5000);
    const timeoutId_bot = setTimeout(() => controller_bot.abort(), 5000);

    try {

      const pocketbase_response = await fetch(`${process.env.POCKETBASE_URL}/api/health`, { signal: controller_pb.signal });
      clearTimeout(timeoutId_pb);
      final_status.push({ pocketbase: "online" })
    } catch (err) {
      console.log(err)

      final_status.push({ pocketbase: "offline" })

    }

    try {

      const bot_response = await fetch(`${process.env.NEXT_PUBLIC_BOT_API_URL}/fetchGuilds`, { signal: controller_bot.signal });
      clearTimeout(timeoutId_bot);
      final_status.push({ bot: "online" })
    } catch (err) {
      console.log(err)
      final_status.push({ bot: "offline" })

    }

    return Response.json(final_status);
  } catch (error) {
    final_status.push({ pocketbase: "offline" })
    final_status.push({ bot: "offline" })

    return Response.json(final_status);
  }


}