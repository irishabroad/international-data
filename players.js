const fs = require('fs');

const players = JSON.parse(fs.readFileSync('./players.json', 'utf-8')).players;

const getPlayerById = (playerId) => players.filter(p => p.id === playerId)[0];

exports.getPlayerById = getPlayerById;