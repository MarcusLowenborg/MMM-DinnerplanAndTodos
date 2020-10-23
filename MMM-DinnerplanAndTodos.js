/* eslint-disable prettier/prettier */

/* Magic Mirror
 * Module: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

Module.register("MMM-DinnerplanAndTodos", {
	defaults: {
		adminGuiPort: 8081,
		type: "todo"
	},

	// Required version of MagicMirror
	requiresVersion: "2.1.0",

	dinner: undefined,
	todos: undefined,

	start: function () {

		//Flag for check if module is loaded
		this.loaded = false;
		const type = this.config.type;

		console.log("1. MMM-DinnerplanAndTodos.js -> this.config.adminGuiPort = " + this.config.adminGuiPort);
		this.sendSocketNotification("MMM-DinnerplanAndTodos-INIT", this.config);

		if (type !== undefined && type.includes("todo")) {
			this.sendSocketNotification("MMM-DinnerplanAndTodos-getTodos");
		}

		if (type !== undefined && type.includes("dinner")) {
			this.sendSocketNotification("MMM-DinnerplanAndTodos-getDinner");
		}
	},

	getDom: function () {
		// create element wrapper for show into the module
		const wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		const type = this.config.type;

		if (type !== undefined && type.includes("dinner")) {
			this.addDinnerTable(wrapper);
		}

		if (type !== undefined && type.includes("todo")) {
			this.addTodoTable(wrapper);
		}

		return wrapper;
	},

	addDinnerTable: function (wrapper) {
		if (this.dinner !== undefined) {
			let table = this.createElement(wrapper, "table");
			let thead = this.createElement(table, "thead");
			let thr = this.createElement(thead, "tr");
			this.createElement(thr, "th", this.translate("Day"));
			this.createElement(thr, "th", this.translate("Lunch"));
			this.createElement(thr, "th", this.translate("Dinner"));

			let tbody = this.createElement(table, "tbody");

			this.dinner.forEach(element => {
				let tr = this.createElement(tbody, "tr");
				this.createElement(tr, "td", this.translate(element.day));
				this.createElement(tr, "td", this.translate(element.lunch));
				this.createElement(tr, "td", this.translate(element.dinner));
			});

			table.className = "foodTable";
		}
	},

	addTodoTable: function (wrapper) {
		if (this.todos !== undefined && this.todos.length > 0) {
			let table = this.createElement(wrapper, "table");
			let tbody = this.createElement(table, "tbody");

			let thead = this.createElement(table, "thead");
			let thr = this.createElement(thead, "tr");
			this.createElement(thr, "th", this.translate("Todo"));

			this.todos.forEach(element => {
				let tr = this.createElement(tbody, "tr");
				this.createElement(tr, "td", element.text);
			});

			table.className = "todoTable";
		}
	},

	createElement: function (wrapper, element, contents) {
		var tmpWrapper = document.createElement(element);

		if (contents !== undefined) {
			tmpWrapper.innerHTML = contents;
		}

		wrapper.appendChild(tmpWrapper);

		return tmpWrapper;
	},

	getStyles: function () {
		return ["MMM-DinnerplanAndTodos.css"];
	},

	getTranslations: function () {
		return {
			en: "translations/en.json",
			sv: "translations/sv.json"
		};
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-DinnerplanAndTodos-UPDATE") {
			this.sendSocketNotification("MMM-DinnerplanAndTodos-getTodos");
			this.sendSocketNotification("MMM-DinnerplanAndTodos-getDinner");
		}

		if (notification === "MMM-DinnerplanAndTodos-getTodos") {
			this.todos = payload;
			this.loaded = true;
			this.updateDom(config.animationSpeed);
		}

		if (notification === "MMM-DinnerplanAndTodos-getDinner") {
			this.dinner = payload;
			this.loaded = true;
			this.updateDom(config.animationSpeed);
		}
	}
});
