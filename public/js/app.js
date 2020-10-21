/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

/* Magic Mirror
 * Module: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

window.addEventListener("load", () => {
	const el = $("#app");

	// Compile Handlebar Templates
	const errorTemplate = Handlebars.compile($("#error-template").html());
	const dinnerTemplate = Handlebars.compile($("#dinner-template").html());
	const todoTemplate = Handlebars.compile($("#todo-template").html());

	// Router Declaration
	const router = new Router({
		mode: "history",
		page404: (path) => {
			const html = errorTemplate({
				color: "grey",
				title: "Error 404 - Page NOT Found!",
				message: `The path "/${path}" does not exist on this site`,
			});
			el.html(html);
		},
	});

	// Instantiate api handler
	const api = axios.create({
		// baseURL: "http://localhost:80/api",
		baseURL: "http://localhost:" + window.location.port + "/api",
		timeout: 5000,
	});

	// Display Error Banner
	const showError = (error) => {
		if (error.response !== null) {
			const { title, message } = error.response.data;
			const html = errorTemplate({ color: "grey", title, message });
			el.html(html);
		}
		else {
			console.log("Unforseen error, API timeout maybe?");
		}
	};

	//
	// Dinner planner
	//

	const enableSubmitButton = () => {
		disableSubmitButton(false);
	};

	const disableSubmitButton = (state = true) => {
		$("#btnSubmit").attr("disabled", state);
	};

	// Perform POST request, calculate and display conversion results
	const saveDinner = async () => {
		// Send post data to Express(proxy) server
		try {
			var dinnerPlan = [];
			["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(day => {
				dinnerPlan.push({
					"day": day,
					"lunch": $("#" + day + "_lunch").val(),
					"dinner": $("#" + day + "_dinner").val()
				});
			});

			await api.post("/dinner", dinnerPlan);
			disableSubmitButton();
		}
		catch (error) {
			showError(error);
		}
		finally {
			$("#result-segment").removeClass("loading");
		}
	};

	// Handle Save Button Click Event
	const saveDinnerHandler = () => {
		// hide error message
		$(".ui.error.message").hide();

		// Post to Express server
		$("#result-segment").addClass("loading");
		saveDinner();
		return true;
	};

	// Display Dinner planner
	router.add("/", async () => {
		// Display loader first
		let html = dinnerTemplate();
		el.html(html);

		try {
			// Load Dinner table
			const response = await api.get("/dinner");
			const dinner = response.data;
			// Display table
			html = dinnerTemplate({ dinner });
			el.html(html);
		}
		catch (error) {
			showError(error);
		}
		finally {
			// Remove loader status
			$(".loading").removeClass("loading");
		}

		// Event handlers
		$(".submit").on("click", saveDinnerHandler);
		$(".input").on("input propertychange paste", enableSubmitButton);
	});

	//
	// Todo list
	//

	// Persist TODO item
	const addItem = async () => {
		// Send post data to Express(proxy) server
		try {
			var todoItem = $("#addTodo").val().trim();

			if (todoItem !== "") {
				// Display loader first
				let html = todoTemplate();
				el.html(html);

				// Load todo list
				const response = await api.post("/todo", { todoItem });
				// const todos = response.data;

				router.navigateTo("todo");
			}
		}
		catch (error) {
			showError(error);
		}
		finally {
			$(".loading").removeClass("loading");
		}
	};

	// Handle Save Button Click Event
	const addItemHandler = () => {
		// Hide error message
		$(".ui.error.message").hide();

		// Post to Express server
		addItem();
	};

	const deleteItem = async (event) => {
		// Send post data to Express(proxy) server
		try {
			// Display loader first
			let html = todoTemplate();
			el.html(html);

			const response = await api.delete("/todo/" + event.target.id.substr(7));
			const todos = response.data;

			router.navigateTo("todo");
		}
		catch (error) {
			showError(error);
		}
		finally {
			$(".loading").removeClass("loading");
		}
	};

	const deleteItemHandler = (event) => {
		deleteItem(event);

		// TODO ???
		// $("div[name^="delete_0"]").hide()
	};

	router.add("/todo", async () => {
		// Display loader first
		let html = todoTemplate();
		el.html(html);

		try {
			// Load todo list
			const response = await api.get("/todo");
			const todos = response.data;

			// Display table
			html = todoTemplate({ todos });
			el.html(html);
		}
		catch (error) {
			showError(error);
		}
		finally {
			// Remove loader status
			$(".loading").removeClass("loading");
		}

		// Event handlers
		$("#addTodoButton").on("click", addItemHandler);
		$("div[id^='delete_']").on("click", "", deleteItemHandler);
		$("i[id^='delete_']").on("click", "", deleteItemHandler);
	});

	//
	// Menu navigation
	//

	// Navigate app to current url
	router.navigateTo(window.location.pathname);

	// Highlight Active Menu on Refresh/Page Reload
	const link = $(`a[href$="${window.location.pathname}"]`);
	link.addClass("active");

	$("a").on("click", (event) => {
		// Block browser page load
		event.preventDefault();

		// Highlight Active Menu on Click
		const target = $(event.target);
		$(".item").removeClass("active");
		target.addClass("active");

		// Navigate to clicked url
		const href = target.attr("href");
		const path = href.substr(href.lastIndexOf("/"));
		router.navigateTo(path);
	});
});

