const players = require('../lib/players');
const games = require('../lib/games');
const managers = require('../lib/managers');

const playerId = parseInt(process.argv[2]);
const player = players.getPlayerById(playerId);
const caps = games.getPlayerCaps(player.id);
const debut = caps[0];
const manager = managers.getManagerByDate(debut.date);
console.log(`${player.firstName} ${player.surName} was given his debut by ${manager.name}`);
