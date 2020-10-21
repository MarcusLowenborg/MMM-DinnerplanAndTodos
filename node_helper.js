/* eslint-disable prettier/prettier */

/* Magic Mirror
 * Node Helper: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const AdminBackend = require("./admin_backend.js");
const { getDinner } = require("./lib/dinner-service");
const { getTodos } = require("./lib/todo-service");

let adminBackend;
let config = null;

/* socketNotificationReceived(notification, payload)
 * This method is called when a socket notification arrives.
 *
 * argument notification string - The identifier of the noitication.
 * argument payload mixed - The payload of the notification.
 */
function socketNotificationReceived(notification, payload) {
	if (notification === "MMM-DinnerplanAndTodos-INIT" && config === null) {
		config = payload;
		adminBackend = new AdminBackend(config, this);
	}

	if (notification === "MMM-DinnerplanAndTodos-getTodos") {
		this.sendSocketNotification("MMM-DinnerplanAndTodos-getTodos", getTodos());
	}

	if (notification === "MMM-DinnerplanAndTodos-getDinner") {
		this.sendSocketNotification("MMM-DinnerplanAndTodos-getDinner", getDinner());
	}
};

function onUpdateCallback() {
	this.sendSocketNotification("MMM-DinnerplanAndTodos-UPDATE");
}

module.exports = NodeHelper.create({
	socketNotificationReceived,
	onUpdateCallback
});
