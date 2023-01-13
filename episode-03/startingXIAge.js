const fs = require('fs');

const countries = require('../lib/countries');
const levels = require('../lib/levels');
const players = require('../lib/players');
const utils = require('../lib/utils');

const games = JSON.parse(fs.readFileSync('../data/games.json', 'utf-8')).games;

const calculatePlayerAge = (playerId, date) => {
  const player = players.getPlayerById(playerId);
  const dateOfBirth = utils.toDayJs(player.dateOfBirth ?? date);
  const age = date.diff(dateOfBirth, 'day');
  return age;
};

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

const result = games.map(calculateStartingXIAverageAge);

console.table(result);
