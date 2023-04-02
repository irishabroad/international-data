const fs = require('fs');

const countries = require('../lib/countries');
const levels = require('../lib/levels');
const utils = require('../lib/utils');
const managers = require('../lib/managers');

const games = JSON.parse(fs.readFileSync('../data/games.json', 'utf-8')).games;

/**
 * Return if both team objects in this game have a ranking attribute
 * @param  {object} game a game object
 * @return {boolean}	true if both homeTeam and awayTeam objects in this game have a ranking attribute, false otherwise
 */
const ranked = (game) => {
  return game.homeTeam.hasOwnProperty('ranking') && game.awayTeam.hasOwnProperty('ranking');
};

/**
 * Return if this game is a loss for the Republic of Ireland or not
 * @param  {object}	game a game object
 * @return {boolen}	true if Ireland lost this game, false otherwise
 */
const isLoss = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const opposition = utils.getOppositionFromGame(game);
  return opposition.scored > ireland.scored;
};

/**
 * Create the result object to be displayed in the console
 * @param  {object} game a game object
 */
const processGame = (game) => {
  const manager = managers.getManagerByDate(game.date);
	const formattedDate = utils.toDayJs(game.date).format('dddd, D MMMM YYYY');
	const level = levels.getLevelById(game.level);
  const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
  const awayTeam = countries.getCountryById(game.awayTeam.teamRef);
  return {
    manager: manager.name,
    date: formattedDate,
    level: level.name,
    home: `${homeTeam.name}(${game.homeTeam.ranking})`,
    score: `${game.homeTeam.scored}-${game.awayTeam.scored}`,
    away: `${awayTeam.name}(${game.awayTeam.ranking})`
  };
};

const results = games.filter(ranked)  // Filter games where both teams are ranked
                	 	 .filter(isLoss) // Filter games where the Republic of Ireland lost
                	 	 .filter(game => utils.getOppositionFromGame(game).ranking >= 90)  // Filter games where the opposition are ranked 90th, or higher, in the world
                	 	 .map(processGame);

// Log the results to the console in a table
console.table(results);
