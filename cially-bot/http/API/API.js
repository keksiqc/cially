const express = require("express");
const app = express();
const port = process.env.PORT;
const { debug } = require("../../terminal/debug");
const { error } = require("../../terminal/error");
const { syncGuild } = require("./functions/syncGuild");
const { messageCreate } = require("./functions/messageCreate");
const { inviteCreate } = require("./functions/inviteCreate");
const { guildMemberRemove } = require("./functions/guildMemberRemove");
const { guildMemberAdd } = require("./functions/guildMemberAdd");
const { fetchID } = require("./functions/fetchID");
const { fetchGuilds } = require("./functions/fetchGuilds");
const { messageDelete } = require("./functions/messageDelete");
const { messageEdit } = require("./functions/messageEdit");
const { fetchUserData } = require("./functions/fetchUserData");

// PocketBase instance is initialized in individual function files for now.
// const PocketBase = require("pocketbase/cjs");
// const url = process.env.POCKETBASE_URL;
// const pb = new PocketBase(url);

const bodyParser = require("body-parser");
// const multer = require("multer"); // v1.0.5
// const upload = multer(); // for parsing multipart/form-data - Removed as unused

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

async function API(client) {
	app.get("/syncGuild/:guildID", (req, res) => {
		syncGuild(req, res, client);
	});

	app.post("/messageCreate/:guildID", (req, res) => {
		messageCreate(req, res, client);
	});

	app.post("/inviteCreate/:guildID", (req, res) => {
		inviteCreate(req, res, client);
	});

	app.post("/guildMemberAdd/:guildID", (req, res) => {
		guildMemberAdd(req, res, client);
	});

	app.post("/guildMemberRemove/:guildID", (req, res) => {
		guildMemberRemove(req, res, client);
	});

	app.post("/fetchID/:guildID", (req, res) => {
		fetchID(req, res, client);
	});

	app.post("/messageDelete/:guildID", (req, res) => {
		messageDelete(req, res, client);
	});

	app.post("/messageEdit/:guildID", (req, res) => {
		messageEdit(req, res, client);
	});

	app.get("/fetchGuilds", (req, res) => {
		fetchGuilds(req, res, client);
	});

	app.post("/fetchUserData/:guildID", (req, res) => {
		fetchUserData(req, res, client);
	});

	app
		.listen(port, () => {
			debug({
				text: `The API is running on port: ${port}! \n`,
				type: "SUCCESS",
			});
		})
		.on("error", (err) => {
			error({
				text: `API failed to start on port ${port}. Error: ${err.message}`,
			});
			console.error(err);
			// Depending on desired behavior, you might want to exit the process
			// process.exit(1);
		});
}

module.exports = { API };
