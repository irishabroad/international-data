const fs = require('fs');

const countries = require('./countries');
const levels = require('./levels');
const utils = require('./utils');

const games = JSON.parse(fs.readFileSync('./games.json', 'utf-8')).games;
const players = JSON.parse(fs.readFileSync('./players.json', 'utf-8')).players;

const playerWasIntroducedAndScored = (game, playerId) => {
  const playerWasIntroduced = game.substitutes && game.substitutes.some(s => s.playerRef === playerId && s.introducedOn);
  const homePlayerScored = game.homeTeam.goals && game.homeTeam.goals.some(g => g.playerRef === playerId && !g.isOG);
  const awayPlayerScored = game.awayTeam.goals && game.awayTeam.goals.some(g => g.playerRef === playerId && !g.isOG);
  const playerScored = playerWasIntroduced && (homePlayerScored || awayPlayerScored);
  return playerScored;
};

const results = [];
players.forEach(player => {
  const introducedAndScored = games.filter(game => playerWasIntroducedAndScored(game, player.id));
  if(introducedAndScored.length > 0) {
    introducedAndScored.forEach(game => {
      const introducedOn = game.substitutes.filter(s => s.playerRef === player.id && s.introducedOn)[0].introducedOn;
      const goals = (game.homeTeam.teamRef === 0) ? game.homeTeam.goals : game.awayTeam.goals;
      const firstGoal = goals.filter(g => g.playerRef === player.id).sort((g1, g2) => g1.time - g2.time)[0].time;
      const timeToFirstGoal = firstGoal - introducedOn;
      if (timeToFirstGoal <= 9) {        
        results.push({
          player: player,
          date: utils.toDayJs(game.date),
          game: game,
          introducedOn: introducedOn,
          firstGoal: firstGoal,
          timeToFirstGoal: timeToFirstGoal
        });
      }
    });
  }
});

results.sort((r1, r2) => r1.date - r2.date)
       .forEach(r => {
          const game = r.game;
          const level = levels.getLevelById(game.level);
          const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
          const awayTeam = countries.getCountryById(game.awayTeam.teamRef);
          console.log(`${r.date.format('dddd, D MMM YYYY')}\t${level.name}\t${homeTeam.name} ${game.homeTeam.scored}-${game.awayTeam.scored} ${awayTeam.name}\t${r.player.firstName} ${r.player.surName} - introduced at ${r.introducedOn}, scored at ${r.firstGoal}, time taken ${r.timeToFirstGoal}`);
       });
