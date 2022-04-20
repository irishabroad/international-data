const fs = require('fs');

const countries = JSON.parse(fs.readFileSync('./countries.json', 'utf-8')).countries;

const getCountryById = (countryId) => countries.filter(c => c.id === countryId)[0];

exports.getCountryById = getCountryById;