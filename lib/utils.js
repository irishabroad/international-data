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

/**
 * return the sort order for two dates
 * @param  {Dayjs}  date1 a dayJs object
 * @param  {Dayjs}  date2 a dayJs object
 * @return -1 if date1 is before date2, 1 if date1 is after date2, 0 if they are equal
 */
const sortByDate = (date1, date2) => {
    date1 = dayjs.isDayjs(date1) ? date1 : toDayJs(date1);
    date2 = dayjs.isDayjs(date2) ? date2 : toDayJs(date2);
    return (date1.isBefore(date2)) ? -1 : ((date1.isAfter(date2)) ? 1 : 0);
};

exports.toDayJs = toDayJs;
exports.getIrelandFromGame = getIrelandFromGame;
exports.getOppositionFromGame = getOppositionFromGame;
exports.sortByDate = sortByDate;
