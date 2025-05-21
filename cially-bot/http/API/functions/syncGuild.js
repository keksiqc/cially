const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");
const { GatewayIntentBits } = require("discord.js"); // Import GatewayIntentBits

const { pb } = require("../dbClient"); // Use shared pb instance
const guild_collection_name = process.env.GUILD_COLLECTION; // Assuming this is "guilds"
const { registerGuild } = require("./logic/registerGuild");

const PRESENCE_STALENESS_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

async function syncGuild(req, res, client) {
	const success_message = { code: "success" };
	const error_message = { code: "error" };

	const guildID = req.params.guildID;

	debug({ text: `Syncronization Request Received for Guild ID: ${guildID}` });

	try {
		async function fetchGuildAndSync() {
			try {
				const guildRecord = await pb
					.collection(guild_collection_name)
					.getFirstListItem(`discordID = "${guildID}"`);

				if (guildRecord?.discordID) {
					async function setNewData() {
						const Guild = client.guilds.cache.get(
							`${String(guildRecord.discordID)}`,
						);

						if (!Guild) {
							error({
								text: `Bot is not in guild ${guildRecord.discordID}, but a DB record exists.`,
							});
							res.status(404).send(error_message);
							return;
						}

						// Intent Check for GuildPresences
						if (!client.options.intents.has(GatewayIntentBits.GuildPresences)) {
							debug({
								// Use debug for this warning as it's not a fatal error for sync itself, but impacts data quality
								text: `WARNING: GuildPresences intent is not enabled. Presence data (online/idle/dnd counts) for guild ${Guild.id} will likely be inaccurate.`,
							});
						}

						let onlineCount = guildRecord.online || 0;
						let idleCount = guildRecord.idle || 0;
						let dndCount = guildRecord.dnd_count || 0; // Assuming dnd_count is the field name if you store it
						let offlineCount = guildRecord.offline || 0;
						let newLastPresenceSyncedAt = guildRecord.lastPresenceSyncedAt;

						const now = Date.now();
						const lastSync = guildRecord.lastPresenceSyncedAt
							? new Date(guildRecord.lastPresenceSyncedAt).getTime()
							: 0;

						if (!lastSync || now - lastSync > PRESENCE_STALENESS_THRESHOLD_MS) {
							debug({
								text: `Presence data for guild ${Guild.id} is stale or missing. Fetching members...`,
							});
							try {
								await Guild.members.fetch(); // This is the expensive call
								const statusCount = { online: 0, idle: 0, dnd: 0, offline: 0 };
								for (const member of Guild.members.cache.values()) {
									const status = member.presence?.status || "offline";
									if (statusCount[status] !== undefined) {
										statusCount[status]++;
									}
								}
								onlineCount = statusCount.online;
								idleCount = statusCount.idle;
								dndCount = statusCount.dnd; // dnd is often combined with online by Discord for "green" status
								offlineCount = statusCount.offline;
								newLastPresenceSyncedAt = new Date().toISOString();
								debug({
									text: `Successfully fetched and updated presence for guild ${Guild.id}.`,
								});
							} catch (fetchMembersError) {
								error({
									text: `Failed to fetch members for guild ${Guild.id}. Using potentially stale presence data.`,
								});
								console.error(fetchMembersError);
								// Keep existing counts from guildRecord if fetch fails
							}
						} else {
							debug({
								text: `Presence data for guild ${Guild.id} is recent. Skipping member fetch.`,
							});
						}

						const channels = Guild.channels.cache.size;
						const roles = Guild.roles.cache.size;
						const bans = Guild.bans.cache.size;
						const owner = await Guild.fetchOwner();
						const icon_url = await Guild.iconURL();
						const vanity_url = Guild.vanityURLCode;

						let vanity_uses = guildRecord.vanity_uses; // Keep stored if not re-fetched
						if (!lastSync || now - lastSync > PRESENCE_STALENESS_THRESHOLD_MS) {
							// Also refresh vanity if presence is stale
							try {
								const vanityData = await Guild.fetchVanityData();
								vanity_uses = vanityData.uses;
							} catch (err) {
								debug({
									text: `Could not fetch vanity uses for guild ${Guild.id} (possibly no vanity URL or no permissions): ${err.message}`,
								});
								vanity_uses = -1; // Indicate error or not available
							}
						}

						debug({ text: `Syncing Guild: ${Guild.name}, ${Guild.id}` });
						const newData = {
							name: Guild.name,
							members: Guild.memberCount,
							available: Guild.available,
							discord_partner: Guild.partnered,
							channels: channels,
							roles: roles,
							bans: bans,
							creation_date: Guild.createdAt.toISOString(),
							owner_username: owner.user.username,
							icon_url: icon_url,
							description: Guild.description,
							vanity_url: vanity_url,
							vanity_uses: vanity_uses,
							online: onlineCount, // Use calculated or existing
							dnd_count: dndCount, // Assuming you add a dnd_count field
							offline: offlineCount, // Use calculated or existing
							idle: idleCount, // Use calculated or existing
							lastPresenceSyncedAt: newLastPresenceSyncedAt, // Update timestamp
						};

						try {
							const updatedRecord = await pb
								.collection(guild_collection_name) // Use variable
								.update(guildRecord.id, newData);
							debug({
								text: `Guild got synced: ${Guild.name}, ${Guild.id}`,
							});
							res.send(success_message);
						} catch (dbUpdateError) {
							error({ text: "Failed to push new data to DB." });
							console.error(dbUpdateError);
							res.status(500).send(error_message);
						}
					}
					await setNewData(); // Added await
				} else {
					// This case should ideally not be reached if getFirstListItem is used and discordID is always set
					debug({
						text: `Guild record found for ${guildID}, but discordID field is missing or null.`,
					});
					res.status(404).send(error_message);
				}
			} catch (fetchErr) {
				if (fetchErr.status === 404) {
					debug({
						text: `Guild with ID ${guildID} not found in database for sync.`,
					});
					// Optionally, attempt to register it, though sync is usually for existing guilds
					// await registerGuild(guildID);
					res.status(404).send(error_message);
				} else {
					error({
						text: `Failed to fetch guild for sync. GuildID: ${guildID}`,
					});
					console.error(fetchErr);
					res.status(500).send(error_message);
				}
			}
		}
		await fetchGuildAndSync(); // Added await
	} catch (outerErr) {
		// Catch any errors from fetchGuildAndSync if they weren't handled (should be rare)
		error({ text: "Outer error in syncGuild handler." });
		console.error(outerErr);
		if (!res.headersSent) {
			// Ensure headers aren't already sent
			res.status(500).send(error_message);
		}
	}
}

module.exports = { syncGuild };
