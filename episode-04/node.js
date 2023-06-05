const players = require('../lib/players');
const games = require('../lib/games');
const levels = require('../lib/levels');
const utils = require('../lib/utils');
const countries = require('../lib/countries');

const player = players.getPlayerById(369);
const competitiveStarts = games.getPlayerStarts(player.id)
                               .filter(g => levels.isCompetitive(g.level));

const firstCompetitiveStart = competitiveStarts[0];
const dateOfBirth = utils.toDayJs(player.dateOfBirth);
const firstCompetitiveStartDate = utils.toDayJs(firstCompetitiveStart.date);
const age = firstCompetitiveStartDate.diff(dateOfBirth, 'day');
const name = `${player.firstName} ${player.surName}`;
const date = firstCompetitiveStartDate.format('dddd, D MMMM YYYY');
const level = levels.getLevelById(firstCompetitiveStart.level).name;
const homeTeam = countries.getCountryById(firstCompetitiveStart.homeTeam.teamRef).name;
const score = `${firstCompetitiveStart.homeTeam.scored}-${firstCompetitiveStart.awayTeam.scored}`;
const awayTeam = countries.getCountryById(firstCompetitiveStart.awayTeam.teamRef).name;
console.log(`${name} was ${age} days old on his competitive debut, on ${date} in a ${level} that ended ${homeTeam} ${score} ${awayTeam}`);
