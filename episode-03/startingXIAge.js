const dayjs = require('dayjs');

const players = require('../lib/players');
const utils = require('../lib/utils');

const playerId = parseInt(process.argv[2]);
const dateId = process.argv[3];

const player = players.getPlayerById(playerId);
const dateOfBirth = utils.toDayJs(player.dateOfBirth);
const date = utils.toDayJs(dateId);
const age = date.diff(dateOfBirth, 'year');
console.log(`${player.firstName} ${player.surName} was ${age} years old on ${date.format('dddd, D MMMM YYYY')}`);
