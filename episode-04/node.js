const players = require('../lib/players');
const games = require('../lib/games');
const levels = require('../lib/levels');
const utils = require('../lib/utils');
const countries = require('../lib/countries');

const allPlayers = players.getAllPlayers();

const firstCompetitiveStart = (player) => {
    const competitiveStarts = games.getPlayerStarts(player.id)
                                   .filter(g => levels.isCompetitive(g.level));

    const firstCompetitiveStart = competitiveStarts[0];
    const dateOfBirth = utils.toDayJs(player.dateOfBirth);
    const firstCompetitiveStartDate = utils.toDayJs(firstCompetitiveStart.date);
    const age = firstCompetitiveStartDate.diff(dateOfBirth, 'day');
    return {
        name: `${player.firstName} ${player.surName}`,
        date: firstCompetitiveStartDate.format('dddd, D MMMM YYYY'),
        age: age,
        level: levels.getLevelById(firstCompetitiveStart.level).name,
        homeTeam: countries.getCountryById(firstCompetitiveStart.homeTeam.teamRef).name,
        score: `${firstCompetitiveStart.homeTeam.scored}-${firstCompetitiveStart.awayTeam.scored}`,
        awayTeam: countries.getCountryById(firstCompetitiveStart.awayTeam.teamRef).name
    };
};

const results = allPlayers.map(firstCompetitiveStart);
console.table(results);
