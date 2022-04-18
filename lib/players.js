const fs = require('fs');

const players = JSON.parse(fs.readFileSync('../data/players.json', 'utf-8')).players;

const getPlayerById = (playerId) => players.find(p => p.id === playerId);

exports.getPlayerById = getPlayerById;