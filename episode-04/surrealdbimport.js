const fs = require('fs');
const { default: Surreal } = require('surrealdb.js');

const db = new Surreal('http://127.0.0.1:8000/rpc');

const dataDirectory = '../data';
const levels = JSON.parse(fs.readFileSync(`${dataDirectory}/levels.json`, 'utf-8')).levels;
const players = JSON.parse(fs.readFileSync(`${dataDirectory}/players.json`, 'utf-8')).players;
const countries = JSON.parse(fs.readFileSync(`${dataDirectory}/countries.json`, 'utf-8')).countries;
const games = JSON.parse(fs.readFileSync(`${dataDirectory}/games.json`, 'utf-8')).games;

/**
 * Helper method to convert a level JSON object to a string to be inserted 
 * @param  {Object} level - a JSON object representing the level a game is played at
 * @return {string} a SurrealQL CREATE statement for a level
 */
const levelToCreateStatement = (level) => {
    return `CREATE levels:${level.id} CONTENT { id:${level.id}, name:'${level.name}', isCompetitive: ${level.isCompetitive}      };`;
};

/**
 * Helper method to convert a player JSON object to a string to be inserted
 * @param  {Object} player - a JSON object representing an Irish international player
 * @return {string} a SurrealQL CREATE statement for a player
 */
const playerToCreateStatement = (player) => {
    const dateOfBirth = (player.dateOfBirth) ? `, dateOfBirth: "${new Date(player.dateOfBirth + "T12:00:00.000Z").toISOString()}"`: "";
    const dateOfDeath = (player.dateOfDeath) ? `, dateOfDeath: "${new Date(player.dateOfDeath + "T12:00:00.000Z").toISOString()}"`: "";
    const position = (player.position) ? `, position: "${player.position}"` : "";
    return `CREATE players:${player.id} CONTENT { id:${player.id}, firstName:"${player.firstName}", surName:"${player.surName}"${dateOfBirth}${dateOfDeath}${position}};`;
};

/**
 * Helper method to convert a country JSON object to a string to be inserted 
 * @param  {Object} country - a JSON object representing an international team
 * @return {string} a SurrealQL CREATE statement for a country
 */
const countryToCreateStatement = (country) => {
    return `CREATE countries:${country.id} CONTENT {id:${country.id}, name: '${country.name}', abbreviation: '${country.abbreviation}'};`;
};

/**
 * Helper method to convert a game JSON object to a string to be inserted 
 * @param  {Object} game - a JSON object representing an international game
 * @return {string} a SurrealQL CREATE statement for an international game
 */
const gameToCreateStatement = (game) => {
    const homeTeam = teamToCreateStatement(game.homeTeam);
    const awayTeam = teamToCreateStatement(game.awayTeam);
    const startingXI = game.startingXI.map(matchDayPlayerToCreateStatement).join(',');
    const substitutes = game.hasOwnProperty('substitutes') ? `, substitutes: [${game.substitutes.map(matchDayPlayerToCreateStatement).join(',')}]` : '';
    const bookings = game.hasOwnProperty('bookings') ? bookingsToCreateStatement(game.bookings) : '';
    const sendingsOff = game.hasOwnProperty('sendingsOff') ? sendingsOffToCreateStatement(game.sendingsOff) : '';
    return `CREATE games:${game.id} CONTENT {id: ${game.id}, date: "${new Date(game.date + "T12:00:00.000Z").toISOString()}", level: levels:${game.level}, homeTeam: ${homeTeam}, awayTeam: ${awayTeam}, startingXI: [${startingXI}]${substitutes}${bookings}${sendingsOff}};`;
};

/**
 * Helper method to convert a team JSON object to a string for a SurrealQL CREATE statement
 * @param  {Object} team - a JSON object representing an international team in a game
 * @return {string} a string representing an international team for a CREATE statement
 */
const teamToCreateStatement = (team) => {
    const goals = team.hasOwnProperty('goals') ? goalsToCreateStatement(team.goals) : '';
    const createStatement = `{country: countries:${team.teamRef}, scored: ${team.scored}${goals}}`;
    return createStatement;
};

/**
 * Helper method to convert array of goal JSON objects to a SurrealQL CREATE statement
 * @param  {Object[]} goals - an array of objects representing goals scored in an international game
 * @return {string} a string representing the goals scored in an international game for a CREATE statement
 */
const goalsToCreateStatement = (goals) => {
    const createStatement = `, goals: [${goals.map(goalToCreateStatement).join(',')}]`;
    return createStatement;
};

/**
 * Helper method to convert a goal JSON object to a SurrealQL CREATE statement
 * @param  {Object} goal - a JSON object representing a goal scored in an international game
 * @return {string} a string representing a goal scored in an international game for a CREATE statement
 */
const goalToCreateStatement = (goal) => {
    const isPenalty = (goal.isPenalty) ? ', isPenalty: true' : '';
    const isOG = (goal.isOG) ? ', isOG: true' : '';
    const createStatement = `{player: players:${goal.playerRef}, time: ${goal.time}${isPenalty}${isOG}}`;
    return createStatement;
};

/**
 * Helper method to convert an array of booking JSON objects to a SurrealQL CREATE statement
 * @param  {Object[]} bookings - an array of JSON objects representing the bookings in an international game
 * @return {string} a string representing the bookings in an international game for a CREATE statement
 */
const bookingsToCreateStatement = (bookings) => {
    const bookingsCreateStatement = bookings.map(b => `{player: players:${b.playerRef}}`);
    return `, bookings: [${bookingsCreateStatement.join(',')}]`;
};

/**
 * Helper method to convert an array of sendingOff JSON objects to a SurrealQL CREATE statement
 * @param  {Object[]} sendingsOff - an array of JSON objects representing the sendings off in an international game
 * @return {string} a string representing the sendings off in an international game for a CREATE statement
 */
const sendingsOffToCreateStatement = (sendingsOff) => {
    const sendingsOffCreateStatement = sendingsOff.map(sO => `{player: players:${sO.playerRef}, time: ${sO.time}}`);
    return `, sendingsOff: [${sendingsOffCreateStatement.join(',')}]`;
};

/**
 * Helper method to convert a JSON object representing a player in an international game to a SurrealQL CREATE statement
 * @param  {Object} squadPlayer - a JSON object representing a squad player in an international game
 * @return {string} a string representing a match day player in an international game for a CREATE statement
 */
const matchDayPlayerToCreateStatement = (squadPlayer) => {
    const substitutedOn = squadPlayer.hasOwnProperty('substitutedOn') ? `, substitutedOn: ${squadPlayer.substitutedOn}` : '';
    const introducedOn = squadPlayer.hasOwnProperty('introducedOn') ? `, introducedOn: ${squadPlayer.introducedOn}` : '';
    return `{player: players:${squadPlayer.playerRef}${introducedOn}${substitutedOn}}`;
}

// Create the CREATE statements for levels, countries, players, and games tables
const createLevelStatements = levels.map(levelToCreateStatement);
const createCountryStatements = countries.map(countryToCreateStatement);
const createPlayerStatements = players.map(playerToCreateStatement);
const createGameStatements = games.map(gameToCreateStatement);

/*
 * Sign in to the SurrealDB server, then use the irish namespace and international database
 * Use the CREATE statements to create the objects on the levels, countries, players, and games tables
 */
async function main() {
    try {
        await db.signin({
            user: 'root',
            pass: 'root',
        });
        await db.use('irish', 'international');
        for (createLevelStatement of createLevelStatements) {
            await db.query(createLevelStatement);
        }
        for (createCountryStatement of createCountryStatements) {
            await db.query(createCountryStatement);
        }
        for (createPlayerStatement of createPlayerStatements) {
            await db.query(createPlayerStatement);
        }
        for (createGameStatement of createGameStatements) {
            await db.query(createGameStatement);
        }
    } catch(e) {
        console.error('Error occured processing script:', e);
    } finally {
        db.close();
    }
}

main();
