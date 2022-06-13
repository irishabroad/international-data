const fs = require('fs');

const countries = JSON.parse(fs.readFileSync('./countries.json', 'utf-8')).countries;

const getCountryById = (countryId) => countries.find(c => c.id === countryId);

exports.getCountryById = getCountryById;