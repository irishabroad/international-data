const fs = require('fs');

const countries = require('./countries');
const levels = require('./levels');
const utils = require('./utils');
const managers = require('./managers');

const games = JSON.parse(fs.readFileSync('./games.json', 'utf-8')).games;

/**
 * Return if both team objects in this game have a ranking attribute
 * @param  {object} game a game object
 * @return {boolean}	true if both homeTeam and awayTeam objects in this game have a ranking attribute, false otherwise
 */
const ranked = (game) => {
  return game.homeTeam.hasOwnProperty('ranking') && game.awayTeam.hasOwnProperty('ranking');
};

/**
 * Return if this game is a win for the Republic of Ireland or not
 * @param  {object}	game a game object
 * @return {boolen}	true if Ireland won this game, false otherwise
 */
const isWin = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const opposition = utils.getOppositionFromGame(game);
  return opposition.scored < ireland.scored;
};

/**
 * Return if the opposition had a higher ranking or not
 * @param  {object} game a game object
 * @return {boolean}	true if the object for the opposition have a higher ranking(i.e. a lower numeric value) than Ireland's ranking, false otherwise
 */
const higherRankedOpposition = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const opposition = utils.getOppositionFromGame(game);
  return opposition.ranking < ireland.ranking;
};

/**
 * Add the margin of victory for Ireland, i.e. the difference between the number of goals scored by both teams, to the game object
 * @param  {object} game a game object
 */
const calculateMarginOfVictory = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const opposition = utils.getOppositionFromGame(game);
  const marginOfVictory = ireland.scored - opposition.scored;
	return Object.assign(game, {marginOfVictory: marginOfVictory});
};

/**
 * Log the details of the game to the console
 * @param  {object} game a game object
 */
const processGame = (game) => {
	const manager = managers.getManagerByDate(game.date);
	const formattedDate = utils.toDayJs(game.date).format('dddd, D MMMM YYYY');
	const level = levels.getLevelById(game.level);
  const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
  const awayTeam = countries.getCountryById(game.awayTeam.teamRef);
  console.log(`${manager.name}\t${formattedDate}\t${level.name}\t${homeTeam.name}(${game.homeTeam.ranking})\t${game.homeTeam.scored}-${game.awayTeam.scored}\t${awayTeam.name}(${game.awayTeam.ranking})\t${game.marginOfVictory}`);
};

games.filter(ranked)
	 	 .filter(isWin)
 	 	 .filter(higherRankedOpposition)
	 	 .filter(game => levels.getLevelById(game.level).isCompetitive)
	 	 .map(calculateMarginOfVictory)
	 	 .sort((game1, game2) => game2.marginOfVictory - game1.marginOfVictory)
	 	 .forEach(processGame);
