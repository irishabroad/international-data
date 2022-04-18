const players = require('../lib/players');

const player = players.getPlayerById(parseInt(process.argv[2]));

console.log(player);
