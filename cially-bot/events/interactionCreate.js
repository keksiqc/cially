// Imports
const { Events, MessageFlags } = require("discord.js");
const { error } = require("../terminal/error");

// Event
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			error({
				text: `No command matching ${interaction.commandName} was found.`,
			});
			return;
		}

		try {
			await command.execute(interaction);
		} catch (err) {
			error({
				text: `Error executing command ${interaction.commandName}: ${err.message}`,
			});
			// console.error(err); // Optionally log the full error object for more details

			const errorMessagePayload = {
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			};
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(errorMessagePayload);
			} else {
				await interaction.reply(errorMessagePayload);
			}
		}
	},
};
