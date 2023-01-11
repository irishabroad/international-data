const fs = require('fs');

const games = require('../lib/games');
const managers = require('../lib/managers');

const players = JSON.parse(fs.readFileSync('../data/players.json', 'utf-8')).players;

/**
 * Create an object containing a player's name and the manager who gave him his debut, if available
 * @param  {player} object a player object
 * @return a JSON object containing the names of a player and the manager who gave him his debut
 */
const playerToDebutManager = (player) => {
	const retVal = {
		player: `${player.firstName} ${player.surName}`
	};
	const caps = games.getPlayerCaps(player.id);
	if (caps.length > 0) {
		const debut = caps[0];
		const manager = managers.getManagerByDate(debut.date);
		retVal.manager = manager?.name;
	}
	return retVal;
};

/**
 * Create an array of objects containing a manager, and an array of player names
 * @param  {result} an array containing objects with a manager's name and an array of player names
 * @param  {item} the object to process, containing the names of a player and the manager who gave him his debut
 * @return an array of objects containing a manager and the players he awarded debuts to
 */
const managerToDebutPlayers = (result, item) => {
	let manager = result.find(r => r.manager === item.manager);
	if (manager === undefined) {
		manager = {
			manager: item.manager,
			players: []
		};
		result.push(manager);
	}
	manager.players.push(item.player);
	return result;
};

/**
 * Create the result object to be displayed in the console
 * @param  {result} object an object containing a manager, and an array of objects containing a player and that player's debut
 * @return  {object} result the result object to display in the console containing a manager's name and the number of players he awarded debuts to
 */
const processResult = (result) => {
	return {
		manager: result.manager,
		debuts: result.players.length
	};
};

const result = players.map(playerToDebutManager)
                      .filter(r => r.manager)
                      .reduce(managerToDebutPlayers, [])
                      .map(processResult);

console.table(result);
