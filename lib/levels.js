const fs = require('fs');

const levels = JSON.parse(fs.readFileSync('../data/levels.json', 'utf-8')).levels;

const getLevelById = (levelId) => levels.find(l => l.id === levelId);

const isCompetitive = (levelId) => [1, 2, 3, 5, 6, 7, 10].indexOf(levelId) != -1;

exports.getLevelById = getLevelById;
exports.isCompetitive = isCompetitive;
