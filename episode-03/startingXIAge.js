const fs = require('fs');

const countries = require('../lib/countries');
const levels = require('../lib/levels');
const players = require('../lib/players');
const utils = require('../lib/utils');

const games = JSON.parse(fs.readFileSync('../data/games.json', 'utf-8')).games;

/**
 * Calculate the age of a player on a given date
 * @param  {number} playerId the id of a player
 * @param  {date} a datejs object
 * @return {number} the age of a player on the given date, in days
 */
const calculatePlayerAge = (playerId, date) => {
  const player = players.getPlayerById(playerId);
  const dateOfBirth = utils.toDayJs(player.dateOfBirth ?? date);
  const age = date.diff(dateOfBirth, 'day');
  return age;
};

/**
 * Calculate the average age of the starting XI of a game
 * @param  {Object} game a game object
 * @return {Object} the object to display in the console
 */
const calculateStartingXIAverageAge = (game) => {
  const gameDate = utils.toDayJs(game.date);
  const dateString = gameDate.format('dddd, D MMMM YYYY');
  const levelName = levels.getLevelById(game.level).name;
  const homeTeamName = countries.getCountryById(game.homeTeam.teamRef).name;
  const awayTeamName = countries.getCountryById(game.awayTeam.teamRef).name;

  const startingXIAges = game.startingXI.map(sP => calculatePlayerAge(sP.playerRef, gameDate)); 
  const totalAge = startingXIAges.reduce((result, item) => result + item, 0);
  const validAges = startingXIAges.filter((age) => age != 0).length; 
  const averageAgeInDays = (totalAge / validAges);
  const averageAgeInYears = (averageAgeInDays / 365.25);
  return {
   date: dateString,
   level: levelName,
   homeTeam: homeTeamName,
   score: `${game.homeTeam.scored}-${game.awayTeam.scored}`,
   awayTeam: awayTeamName,
   averageAge: averageAgeInYears
  };             
};

const result = games.filter(g => levels.isCompetitive(g.level))
                    .map(calculateStartingXIAverageAge)
                    .filter(r => r.averageAge < 24.9);

console.table(result);
