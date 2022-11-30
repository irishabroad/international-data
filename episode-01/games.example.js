const games = require('../lib/games');
const countries = require('../lib/countries');
const managers = require('../lib/managers');
const levels = require('../lib/levels');
const players = require('../lib/players')
const utils = require('../lib/utils')

const game = games.getGameById(parseInt(process.argv[2]));
const manager = managers.getManagerByDate(game.date);
const level = levels.getLevelById(game.level);
const homeTeam = countries.getCountryById(game.homeTeam.teamRef);
const awayTeam = countries.getCountryById(game.awayTeam.teamRef);

const ireland = game.homeTeam.teamRef === 0 ? game.homeTeam : game.awayTeam;
const homeRanking = game.homeTeam.ranking ? `(${game.homeTeam.ranking})` : '';
const awayRanking = game.awayTeam.ranking ? `(${game.awayTeam.ranking})` : '';

const processPlayerList = (playerList, detail) => {
	if (playerList) {
		console.log(detail)
		playerList.forEach(player => {
			const substitutePlayer = players.getPlayerById(player.playerRef);
			let details = ''
			if (player.substitutedOn || player.introducedOn) {
				const substituted = (player.substitutedOn) ? `substituted on ${player.substitutedOn}` : '';
				const introduced = (player.introducedOn) ? `introduced on ${player.introducedOn}${substituted !== '' ? `, ` : ''}` : '';
				details = `(${introduced}${substituted})`;
			}
			console.log(`${substitutePlayer.firstName} ${substitutePlayer.surName}${details}`);
		});
	}
};

console.log(utils.toDayJs(game.date).format('dddd, D MMMM YYYY'));
console.log(`${homeTeam.name}${homeRanking} ${game.homeTeam.scored}-${game.awayTeam.scored} ${awayTeam.name}${awayRanking}`);
console.log(`${level.name}`);
if (manager) {
	console.log(`Manager: ${manager.name}`);
}
processPlayerList(game.startingXI, 'Starting XI');
processPlayerList(game.substitutes, 'Substitutes');
if (ireland.goals) {
	console.log('Goals')
	ireland.goals.forEach(goal => {
		const goalScorer = players.getPlayerById(goal.playerRef);
		const isPenalty = (goal.isPenalty) ? ', P' : '';
		const isOG = (goal.isOG) ? ', OG' : '';
		const details = `(${goal.time}${isPenalty}${isOG})`;
		console.log(`${goalScorer.firstName} ${goalScorer.surName}${details}`);
	});	
}
if (game.bookings) {
	console.log('Bookings')
	game.bookings.forEach(booking => {
		const bookedPlayer = players.getPlayerById(booking.playerRef);
		console.log(`${bookedPlayer.firstName} ${bookedPlayer.surName}`);
	});	

}
if (game.sendingsOff) {
	console.log('Sendings Off')
	game.sendingsOff.forEach(sendingOff => {
		const sentOffPlayer = players.getPlayerById(sendingOff.playerRef);
		console.log(`${sentOffPlayer.firstName} ${sentOffPlayer.surName}(${sendingOff.time})`);
	});	

}