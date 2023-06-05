const fs = require('fs');
const { MongoClient } = require('mongodb');

const dataDirectory = '../data';
const levels = JSON.parse(fs.readFileSync(`${dataDirectory}/levels.json`, 'utf-8')).levels;
const players = JSON.parse(fs.readFileSync(`${dataDirectory}/players.json`, 'utf-8')).players;
const countries = JSON.parse(fs.readFileSync(`${dataDirectory}/countries.json`, 'utf-8')).countries;
const games = JSON.parse(fs.readFileSync(`${dataDirectory}/games.json`, 'utf-8')).games;

const host = '127.0.0.1';
const port = '27017';
const uri = `mongodb://${host}:${port}`;

/* 
 * Create a new array from the players array 
 * with the date strings for date of birth and death converted to Date objects
 */
const newPlayers = players.map(p => {
    const p2 = p;
    if (p.dateOfBirth) {
        p2.dateOfBirth = new Date(p.dateOfBirth + "T12:00:00.000Z");
    }
    if (p.dateOfDeath) {
        p2.dateOfDeath = new Date(p.dateOfDeath + "T12:00:00.000Z");
    }
    return p2;
});

/* 
 * Create a new array from the games array 
 * with the date string for the date of the game converted to Date objects
 */
const newGames = games.map(g => {
    const g2 = g;
    g2.date = new Date(g.date + "T12:00:00.000Z");    
    return g2;
});

/*
 * Create a MongoDB client, then connect to to the database, 
 * and insert the JSON objects in the countries, levels, players, and game arrays 
 * into the relevant collection
 */
async function main() {
	const client = new MongoClient(uri);
    try {
        client.connect();
        const db = client.db('international');
        const playersCollection = db.collection('players');
        const gamesCollection = db.collection('games');
        const levelsCollection = db.collection('levels');
        const countriesCollection = db.collection('countries');

        await countriesCollection.insertMany(countries);
        await levelsCollection.insertMany(levels);
        await playersCollection.insertMany(newPlayers);
        await gamesCollection.insertMany(newGames);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
