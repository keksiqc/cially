// Package Imports
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js"); // Removed Events, REST, Routes
require("dotenv").config(); // Simplified dotenv config
const colors = require("colors"); // Keep for now, for String.prototype extensions
const { error } = require("./terminal/error"); // Import custom error utility

// Config Imports from .env
const token = process.env.TOKEN;
// const clientId = process.env.CLIENT_ID; // clientId is not used in this file

// Explicitly list necessary intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers, // For userJoin, userLeave events
		GatewayIntentBits.GuildMessages, // For messageCreate, messageDelete, messageUpdate
		GatewayIntentBits.MessageContent, // If bot needs to read message content
		GatewayIntentBits.GuildInvites, // For inviteCreate
		// Add any other specific intents your bot relies on.
		// Note: 53608447 is a very broad number, including privileged intents.
		// It's better to be explicit. For example, GuildPresences and GuildMessageTyping are often not needed.
		// If unsure, start with a minimal set and add as required by bot functionality.
		// The number 53608447 includes:
		// Guilds, GuildMembers, GuildModeration (Bans), GuildEmojisAndStickers, GuildIntegrations, GuildWebhooks,
		// GuildInvites, GuildVoiceStates, GuildPresences, GuildMessages, GuildMessageReactions, GuildMessageTyping,
		// DirectMessages, DirectMessageReactions, DirectMessageTyping, MessageContent, GuildScheduledEvents,
		// AutoModerationConfiguration, AutoModerationExecution
		GatewayIntentBits.GuildModeration, // Example: if ban events were tracked
		GatewayIntentBits.GuildVoiceStates, // If bot interacts with voice
		// GatewayIntentBits.GuildPresences, // Often privileged and not needed unless tracking presence
		GatewayIntentBits.GuildMessageReactions, // If bot uses reactions
		// GatewayIntentBits.DirectMessages, // If bot interacts in DMs
		// GatewayIntentBits.DirectMessageReactions,
		// GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution,
	],
});

// Command Handler
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			error({
				text: `The command at ${filePath} is missing a required "data" or "execute" property.`,
			});
		}
	}
}

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with client's token
client.login(token);
