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

const result = players.map(playerToDebutManager);

console.table(result);
