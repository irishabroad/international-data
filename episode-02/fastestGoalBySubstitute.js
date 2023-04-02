const fs = require('fs');

const countries = require('../lib/countries');
const games = require('../lib/games');
const levels = require('../lib/levels');
const utils = require('../lib/utils');

const players = JSON.parse(fs.readFileSync('../data/players.json', 'utf-8')).players;

/**
 * Did a given player score in the given game
 * @param  {object} game a game object
 * @param  {integer} playerId the id of a player
 * @return {boolean}  true if there is an object in the goals array of either team object with the playerRef value the same as the playerId parameter, and does not have an "isOG" attribute
 */
const playerScored = (game, playerId) => {
  const homePlayerScored = game.homeTeam.goals && game.homeTeam.goals.some(g => g.playerRef === playerId && !g.isOG);
  const awayPlayerScored = game.awayTeam.goals && game.awayTeam.goals.some(g => g.playerRef === playerId && !g.isOG);
  const playerScored = (homePlayerScored || awayPlayerScored);
  return playerScored;
};

/**
 * Create an array containing the goals scored by the given player when introduced as a substitute
 * @param  {object} player a player object
 * @return {array}  an array of the goals scored by the given player
 */
const getPlayersSubstituteGoals = (player) => {

  return games.getPlayerIntroductions(player.id)
              .filter(game => playerScored(game, player.id))
              .map(game => {
                const substitute = game.substitutes
                                       .find(s => s.playerRef === player.id);

                const introducedOn = substitute.introducedOn;
                const goals = (game.homeTeam.teamRef === countries.IRELAND_ID) ? game.homeTeam.goals : game.awayTeam.goals;
                const playerGoals = goals.filter(g => g.playerRef === player.id)
                                         .map(g => {
                                            const level = levels.getLevelById(game.level);
                                            const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
                                            const awayTeam = countries.getCountryById(game.awayTeam.teamRef);
                                            return Object.assign(g, {
                                              level: game.level, 
                                              homeTeam: {
                                                name: homeTeam.name,
                                                scored: game.homeTeam.scored,
                                              }, 
                                              awayTeam: {
                                                name: awayTeam.name,
                                                scored: game.awayTeam.scored,
                                              },
                                              introducedOn: introducedOn,
                                              timeToGoal: g.time - introducedOn,
                                              date: utils.toDayJs(game.date)
                                            });
                                          });
                return playerGoals;
              })
              .flat();
};

/**
 * Print the results
 * @param  {object} result an object containing the data to be displayed on screen
 */
const processResult = (result) => {
  const player = players.find(p => p.id === result.playerRef);
  const level = levels.getLevelById(result.level);
  return {
    date: result.date.format('dddd, D MMM YYYY'),
    home: result.homeTeam.name,
    score: `${result.homeTeam.scored}-${result.awayTeam.scored}`,
    away: result.awayTeam.name,
    player: `${player.firstName} ${player.surName}`,
    introduced: result.introducedOn,
    scoredAt: result.time,
    timeToGoal: result.timeToGoal
  };
};

const results = players.map(getPlayersSubstituteGoals)  // Get the games where the player was introduced and scored
                       .flat()
                       .filter(r => r.timeToGoal <= 9)  // Filter goals that were scored nine minutes, or less, after the player scored
                       .sort((result1, result2) => result1.date.diff(result2.date, "day"))  // Sort the goals by the date they were scored on
                       .map(processResult);

// Log the results to the console in a table
console.table(results);