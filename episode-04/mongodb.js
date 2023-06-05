const MongoClient = require('mongodb').MongoClient;

const pipeline = [
  { $match: { 'dateOfBirth': {$exists: true} } },
  {
    $lookup: {
      from: 'games',
      let: { playerId: '$id'},
      pipeline: [
        { $lookup: { from: 'levels', localField: 'level', foreignField: 'id', as: 'level' } },
        { $unwind: '$level' },
        { $lookup: { from: 'countries', localField: 'homeTeam.teamRef', foreignField: 'id', as: 'homeTeam.country' } },
        { $unwind: '$homeTeam.country' },
        { $lookup: { from: 'countries', localField: 'awayTeam.teamRef', foreignField: 'id', as: 'awayTeam.country' } },
        { $unwind: '$awayTeam.country' },
        { $match: { $and: [{ $expr: { $in: ['$$playerId', '$startingXI.playerRef'] } }, { 'level.isCompetitive': true }] }},
        { $sort: { date: 1 } },
        { $limit: 1 }
      ],
      as: 'firstCompetitiveStart'
    }
  },
  { $match: { firstCompetitiveStart: { $gt: {$size: 1} }  } },
  { $unwind: '$firstCompetitiveStart' },
  {
    $project: {
      _id: 0,
      name: { $concat: ['$firstName', ' ', '$surName'] },
      date: '$firstCompetitiveStart.date',
      age: { $divide: [{ $subtract: [ '$firstCompetitiveStart.date', '$dateOfBirth'] }, 86400000]},
      levelName: '$firstCompetitiveStart.level.name',
      homeTeam: '$firstCompetitiveStart.homeTeam.country.name',
      score: {$concat: [{$toString: '$firstCompetitiveStart.homeTeam.scored'}, '-', {$toString: '$firstCompetitiveStart.awayTeam.scored'}]},
      awayTeam: '$firstCompetitiveStart.awayTeam.country.name'
    }
  }
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
