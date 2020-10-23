/* eslint-disable prettier/prettier */

/* Magic Mirror
 * Module: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { getDinner, saveDinner } = require("./lib/dinner-service");
const { getTodos, addTodo, deleteTodo } = require("./lib/todo-service");

const app = express();
const AdminBackend = function (config, nodeHelper) {
	console.log("3. admin_backend.js -> adminGuiPort = " + config.adminGuiPort);
	// Enable all CORS requests
	app.use(cors());

	// Set public folder as root
	app.use(express.static(`${__dirname}/public`));

	// Allow front-end access to node_modules folder
	app.use("/scripts", express.static(`${__dirname}/node_modules/`));

	// Parse POST data as URL encoded data
	app.use(bodyParser.urlencoded({
		extended: true,
	}));

	// Parse POST data as JSON
	app.use(bodyParser.json());

	// Express Error handler
	const errorHandler = (err, req, res) => {
		if (err.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			res.status(403).send({ title: "Server responded with an error", message: err.message });
		}
		else if (err.request) {
			// The request was made but no response was received
			res.status(503).send({ title: "Unable to communicate with server", message: err.message });
		}
		else {
			// Something happened in setting up the request that triggered an Error
			res.status(500).send({ title: "An unexpected error occurred", message: err.message });
		}
	};

	//
	// DINNERPLANNER
	//

	// Fetch Dinner plan
	app.get("/api/dinner", async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			res.send(getDinner());
		}
		catch (error) {
			errorHandler(error, req, res);
		}
	});

	// Persist dinner plan
	app.post("/api/dinner", async (req, res) => {
		try {
			const dinner = req.body;
			saveDinner(dinner);
			res.setHeader("Content-Type", "application/json");
			res.send(getDinner());
			nodeHelper.onUpdateCallback();
		}
		catch (error) {
			errorHandler(error, req, res);
		}
	});

	//
	// TODO LIST
	//

	// Get todo list
	app.get("/api/todo", async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			res.send(getTodos());
		}
		catch (error) {
			errorHandler(error, req, res);
		}
	});

	// Persist todo item
	app.post("/api/todo", async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			res.send(addTodo(req.body));
			nodeHelper.onUpdateCallback();
		}
		catch (error) {
			errorHandler(error, req, res);
		}
	});

	// Delete todo item
	app.delete("/api/todo/:index", async (req, res) => {
		try {
			res.setHeader("Content-Type", "application/json");
			res.send(deleteTodo(req.params.index));
			nodeHelper.onUpdateCallback();
		}
		catch (error) {
			errorHandler(error, req, res);
		}
	});

	//
	// PLUMBING
	//

	// Redirect all traffic to index.html
	app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

	// Listen for HTTP requests on port adminGuiPort
	app.listen(config.adminGuiPort, () => {
		console.log("4. admin_backend.js -> listen -> adminGuiPort = " + config.adminGuiPort);
		console.log("AdminBackend listening on port %d", config.adminGuiPort);
	});
};

module.exports = AdminBackend;
