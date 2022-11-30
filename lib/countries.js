const fs = require('fs');

const countries = JSON.parse(fs.readFileSync('../data/countries.json', 'utf-8')).countries;

const getCountryById = (countryId) => countries.find(c => c.id === countryId);

exports.getCountryById = getCountryById;
exports.IRELAND_ID = 0;