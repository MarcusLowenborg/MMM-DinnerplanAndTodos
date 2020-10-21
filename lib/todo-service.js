/* eslint-disable prettier/prettier */

/* Magic Mirror
 * Module: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

var fs = require("fs");

// Data file
const todoFile = `${__dirname}/../private/todo.json`;

/**
 * Get dinner plan
 */
function getTodos() {
	return JSON.parse(fs.readFileSync(todoFile));
}

/**
 * Persist dinner plan
 */
function addTodo(todoItem) {
	let currentList = getTodos();
	let index = 0;

	currentList.forEach(item => {
		index = item.index;
	});

	currentList.push({
		"index": ++index,
		"text": todoItem["todoItem"]
	});

	fs.writeFileSync(todoFile, JSON.stringify(currentList));
	return currentList;
}

/**
 * Delete specified item
 */
function deleteTodo(deleteIndex) {
	const currentList = getTodos();
	let newList = [];

	currentList.forEach(item => {
		if (item.index !== Number(deleteIndex)) {
			newList.push(item);
		}
	});

	fs.writeFileSync(todoFile, JSON.stringify(newList));
	return newList;
}

module.exports = {
	getTodos,
	addTodo,
	deleteTodo
};