/* eslint-disable prettier/prettier */

/* Magic Mirror
 * Module: MMM-DinnerplanAndTodos
 *
 * By Marcus Löwenborg
 * MIT Licensed.
 */

var fs = require("fs");

// Data file
const dinnerFile = `${__dirname}/../private/dinner.json`;

/**
 * Get dinner plan
 */
function getDinner() {
	return JSON.parse(fs.readFileSync(dinnerFile));
}

/**
 * Persist dinner plan
 */
function saveDinner(dinner) {
	fs.writeFileSync(dinnerFile, JSON.stringify(dinner));
}

module.exports = {
	getDinner,
	saveDinner
};
