const MongoClient = require('mongodb').MongoClient;

const pipeline = [
];

const main = async () => {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  try {
    await client.connect();
    const db = await client.db('international');
    const players = await db.collection('players');
    await players.aggregate(pipeline)
                 .toArray()
                 .then(result => console.table(result));
  } catch(c) {
    console.error(e);
  } finally {
    await client.close();
  }
};

main();
