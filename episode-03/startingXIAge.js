const countries = require('../lib/countries');
const games = require('../lib/games');
const levels = require('../lib/levels');
const players = require('../lib/players');
const utils = require('../lib/utils');

const gameId = parseInt(process.argv[2]);

const calculatePlayerAge = (playerId, date) => {
  const player = players.getPlayerById(playerId);
  const dateOfBirth = utils.toDayJs(player.dateOfBirth);
  const age = date.diff(dateOfBirth, 'year');
  console.log(`${player.firstName} ${player.surName} was ${age} years old on ${date.format('dddd, D MMMM YYYY')}`);
};

const game = games.getGameById(gameId);
const gameDate = utils.toDayJs(game.date);
const dateString = gameDate.format('dddd, D MMMM YYYY');
const levelName = levels.getLevelById(game.level).name;
const homeTeamName = countries.getCountryById(game.homeTeam.teamRef).name;
const awayTeamName = countries.getCountryById(game.awayTeam.teamRef).name;

console.log(`${dateString} ${levelName} ${homeTeamName} ${game.homeTeam.scored}-${game.awayTeam.scored} ${awayTeamName}`);
game.startingXI.forEach(sP => calculatePlayerAge(sP.playerRef, gameDate)); 
