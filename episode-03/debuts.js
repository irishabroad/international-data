const fs = require('fs');

const games = require('../lib/games');
const managers = require('../lib/managers');

const players = JSON.parse(fs.readFileSync('../data/players.json', 'utf-8')).players;

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
