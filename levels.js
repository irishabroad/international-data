const fs = require('fs');

const levels = JSON.parse(fs.readFileSync('./levels.json', 'utf-8')).levels;

const getLevelById = (levelId) => levels.filter(l => l.id === levelId)[0];

exports.getLevelById = getLevelById;