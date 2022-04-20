const managers = require('./managers');

const manager = managers.getManagerByDate(process.argv[2]);

console.log(manager);
