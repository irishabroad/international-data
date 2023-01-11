const fs = require('fs');

const games = require('../lib/games');
const managers = require('../lib/managers');

const players = JSON.parse(fs.readFileSync('../data/players.json', 'utf-8')).players;

const getPlayerDebutManager = (player) => {
	const caps = games.getPlayerCaps(player.id);
	if (caps.length > 0) {
		const debut = caps[0];
		const manager = managers.getManagerByDate(debut.date);
		console.log(`${player.firstName} ${player.surName} was given his debut by ${manager.name}`);
	}
};

players.forEach(getPlayerDebutManager);
