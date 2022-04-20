const fs = require('fs');

const countries = require('./countries');
const levels = require('./levels');
const utils = require('./utils');
const players = require('./players');

const games = JSON.parse(fs.readFileSync('./games.json', 'utf-8')).games;

const irelandScoredAtLeastOneSubstitute = (game) => {
  const ireland = utils.getIrelandFromGame(game);
  const irelandScored = ireland.goals;
  const atLeastOneSubstitute = (game.substitutes) && game.substitutes.some(s => s.introducedOn);
  return irelandScored && atLeastOneSubstitute;
};

games.filter(irelandScoredAtLeastOneSubstitute)
     .forEach(game => {
      const ireland = utils.getIrelandFromGame(game);
      const goals = ireland.goals;
      goals.filter(g => !g.isOG)
           .forEach(goal => {
        if (game.substitutes.some(s => s.playerRef === goal.playerRef)) {
          const player = players.getPlayerById(goal.playerRef);
          const introducedOn = game.substitutes.filter(s => s.playerRef === goal.playerRef)[0].introducedOn;
          const timeToGoal = goal.time - introducedOn;
          if (timeToGoal <= 9) {
            const level = levels.getLevelById(game.level);
            const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
            const awayTeam = countries.getCountryById(game.awayTeam.teamRef);
            console.log(`${utils.toDayJs(game.date).format('dddd, D MMM YYYY')}\t${level.name}\t${homeTeam.name} ${game.homeTeam.scored}-${game.awayTeam.scored} ${awayTeam.name}\t${player.firstName} ${player.surName} - introduced at ${introducedOn}, scored at ${goal.time}, time taken ${timeToGoal}`);
          }
        }
      });
});
