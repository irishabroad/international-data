const fs = require('fs');

const countries = require('../lib/countries');
const levels = require('../lib/levels');
const players = require('../lib/players');
const utils = require('../lib/utils');

const games = JSON.parse(fs.readFileSync('../data/games.json', 'utf-8')).games;

/**
 * Filter games where Ireland scored, i.e. the object representing the Ireland team has a "goals" array
 * @param  {object} game a game object
 * @return {boolean}  true if the object representing the Republic of Ireland team has a "goals" array, false otherwise
 */
const irelandScored = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  return ireland.hasOwnProperty('goals') && Array.isArray(ireland.goals);
};

/**
 * Was there at least one introduced substitute
 * @param  {object} game a game object
 * @return {boolean}  true if the at least one substitute was introduced, false otherwise
 */
const atLeastOneIntroducedSubstitute = (game) => {
  return (game.hasOwnProperty('substitutes') && Array.isArray(game.substitutes) && game.substitutes.some(s => s.hasOwnProperty('introducedOn')));
};

/**
 * Create an array of JSON objects for each goal scored by a substitute in a game in the form {
 *    player: {player},
 *    game: {game},
 *    goal: {goal},
 *    introducedOn: {integer},
 *    timeToGoal: {integer}
 *  }
 * 
 * @param  {object} game a game object
 * @return {array}  an array of objects containing a player object, the time they were introduced from the bench, the game, the goals scored by that player, and the time it took to score the goal
 */
const createArrayOfSubstituteGoals = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const goals = ireland.goals;
  return goals.filter(goal => !goal.hasOwnProperty('isOG'))
              .filter(goal => game.substitutes.some(substitute => substitute.playerRef === goal.playerRef))
              .map(goal => {
                const substitute = game.substitutes.find(substitute => substitute.playerRef === goal.playerRef)
                const introducedOn = substitute.introducedOn;
                const timeToGoal = goal.time - introducedOn;
                const player = players.getPlayerById(goal.playerRef);
                return {
                  player: player, 
                  game: game,
                  goalTime: goal.time,
                  introducedOn: introducedOn,
                  timeToGoal: timeToGoal
                };
            });
};

/**
 * Display each result in a console log
 * @param  {object} result the result object to display in the console log
 */
const processResult = (result) => {
  const formattedDate = utils.toDayJs(result.game.date).format('dddd, D MMMM YYYY');
  const level = levels.getLevelById(result.game.level);
  const homeTeam = countries.getCountryById(result.game.homeTeam.teamRef);
  const awayTeam = countries.getCountryById(result.game.awayTeam.teamRef);
  return {
    date: formattedDate,
    level: level.name,
    home: `${homeTeam.name}(${result.game.homeTeam.ranking})`,
    score: `${result.game.homeTeam.scored}-${result.game.awayTeam.scored}`,
    away: `${awayTeam.name}(${result.game.awayTeam.ranking})`,
    player: `${result.player.firstName} ${result.player.surName}`,
    introducedOn: result.introducedOn,
    scoredOn: result.goalTime,
    timeTaken: result.timeToGoal
  };
};

const results = games.filter(irelandScored)                   // Only search games where at least one Ireland player scored
                     .filter(atLeastOneIntroducedSubstitute)  // Only search games where at least one substitute was introduced
                     .flatMap(createArrayOfSubstituteGoals)
                     .filter(result => result.timeToGoal <= 9)
                     .map(processResult);

console.table(results);
