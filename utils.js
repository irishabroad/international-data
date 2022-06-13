const dayjs = require('dayjs');

/**
 * Convert a string in the format yyyy-MM-dd to a dayjs object at 12 noon
 * @param  {string} date a string in the format yyyy-MM-dd
 * @return {dayjs}	a dayjs object
 */
const toDayJs = (date) => dayjs(date + "T12:00:00");

/**
 * Return a JSON object representing the Ireland team in a game
 * @param  game a game object
 * @return a JSON object representing the Ireland team 
 */
const getIrelandFromGame = (game) => game.homeTeam.teamRef === 0 ? game.homeTeam : game.awayTeam;

/**
 * Return a JSON object representing the opposing team in a game
 * @param  game a game object
 * @return a JSON object representing the opposition 
 */
const getOppositionFromGame = (game) => game.homeTeam.teamRef === 0 ? game.awayTeam : game.homeTeam;

exports.toDayJs = toDayJs;
exports.getIrelandFromGame = getIrelandFromGame;
exports.getOppositionFromGame = getOppositionFromGame;
