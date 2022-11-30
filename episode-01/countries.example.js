const countries = require('../lib/countries');

const country = countries.getCountryById(parseInt(process.argv[2]));

console.log(country);
