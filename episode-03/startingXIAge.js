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
  return age;
};

const game = games.getGameById(gameId);
const gameDate = utils.toDayJs(game.date);
const dateString = gameDate.format('dddd, D MMMM YYYY');
const levelName = levels.getLevelById(game.level).name;
const homeTeamName = countries.getCountryById(game.homeTeam.teamRef).name;
const awayTeamName = countries.getCountryById(game.awayTeam.teamRef).name;

console.log(`${dateString} ${levelName} ${homeTeamName} ${game.homeTeam.scored}-${game.awayTeam.scored} ${awayTeamName}`);
const startingXIAges = game.startingXI.map(sP => calculatePlayerAge(sP.playerRef, gameDate)); 
const totalAge = startingXIAges.reduce((result, item) => result + item, 0);
const averageAge = (totalAge / 11);
console.log(`The average age of the starting XI was ${averageAge}`);
