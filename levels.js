const fs = require('fs');

const levels = JSON.parse(fs.readFileSync('./levels.json', 'utf-8')).levels;

const getLevelById = (levelId) => levels.find(l => l.id === levelId);

exports.getLevelById = getLevelById;