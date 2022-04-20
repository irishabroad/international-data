const levels = require('./levels');

const level = levels.getLevelById(parseInt(process.argv[2]));

console.log(level);
