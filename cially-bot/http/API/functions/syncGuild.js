const { debug } = require("../../../terminal/debug");
const { error } = require("../../../terminal/error");

const PocketBase = require("pocketbase/cjs");
const url = process.env.POCKETBASE_URL;
const pb = new PocketBase(url);
const guild_collection_name = process.env.GUILD_COLLECTION;
const { registerGuild } = require("./logic/registerGuild");

// Helper function to fetch vanity data
function fetchVanityData(Guild) {
	return Guild.fetchVanityData()
		.then((res) => {
			return res.uses;
		})
		.catch(() => {
			return -1;
		});
}

// Helper function to update guild data
async function updateGuildData(guild, Guild) {
	const channels = Guild.channels.cache.size;
	const roles = Guild.roles.cache.size;
	const bans = Guild.bans.cache.size;
	const owner = await Guild.fetchOwner();
	const icon_url = await Guild.iconURL();
	const vanity_url = Guild.vanityURLCode;

	await Guild.members.fetch();
	const statusCount = {
		online: 0,
		idle: 0,
		dnd: 0,
		offline: 0,
	};

	Guild.members.cache.forEach((member) => {
		const status = member.presence?.status || "offline";
		if (statusCount[status] !== undefined) {
			statusCount[status]++;
		}
	});

	const vanity_uses = await fetchVanityData(Guild);

	debug({ text: `Syncing Guild: ${Guild.name}, ${Guild.id}` });
	const newData = {
		name: Guild.name,
		members: Guild.memberCount,
		available: Guild.available,
		discord_partner: Guild.partnered,
		channels,
		roles,
		bans,
		creation_date: Guild.createdAt,
		owner_username: owner.user.username,
		icon_url,
		description: Guild.description,
		vanity_url,
		vanity_uses,
		online: statusCount.online + statusCount.dnd,
		offline: statusCount.offline,
		idle: statusCount.idle,
	};

	try {
		await pb.collection("guilds").update(`${guild.id}`, newData);
		debug({
			text: `Guild got synced: ${Guild.name}, ${Guild.id}`,
		});
		return true;
	} catch (err) {
		error({ text: `Failed to push new data: \n${err}` });
		return false;
	}
}

// Main function to fetch guilds and process them
async function processGuilds(
	guildID,
	client,
	res,
	success_message,
	error_message,
) {
	try {
		const guilds = await pb.collection(guild_collection_name).getFullList({
			filter: `discordID ?= '${guildID}'`,
		});

		if (guilds.length > 0) {
			guilds.forEach((guild) => {
				// Check to see if the bot is in the guild
				if (guild.discordID) {
					try {
						const Guild = client.guilds.cache.get(`${String(guild.discordID)}`);
						updateGuildData(guild, Guild);
						res.send(success_message);
					} catch (err) {
						error({
							text: `Failed to sync data for GuildID: ${guild.discordID}\n${err}`,
						});
						res.send(error_message);
					}
				}
			});
		} else {
			debug({
				text: `Failed to fetch guild with ID: ${guildID}`,
			});
			res.send(error_message);
		}
	} catch (err) {
		error({ text: `Failed to fetch guild: \n${err}` });
	}
}

async function syncGuild(req, res, client) {
	const success_message = { code: "success" };
	const error_message = { code: "error" };
	const guildID = req.params.guildID;

	debug({ text: `Syncronization Request Received for Guild ID: ${guildID}` });

	try {
		await processGuilds(guildID, client, res, success_message, error_message);
	} catch (err) {
		console.log(err);
		error({ text: `Failed to communicate with the Database` });
		res.send(error_message);
	}
}

module.exports = { syncGuild };
