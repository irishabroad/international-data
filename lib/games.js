const fs = require('fs');

const games = JSON.parse(fs.readFileSync('../data/games.json', 'utf-8')).games;

const getPlayerCaps = (playerId) => {
	return games.filter(game => {
		const started = game.startingXI.some(sP => sP.playerRef === playerId);
		let introduced = false;
		// If the player started the game, there is no need to check the substitutes
		if (!started) {
			introduced = game.substitutes ? game.substitutes.some(s => s.playerRef === playerId && s.introducedOn) : false;
		}
		return started || introduced;
	});
};

const getPlayerStarts = (playerId) => games.filter(game => game.startingXI.some(sP => sP.playerRef === playerId));

const getPlayerIntroductions = (playerId) => games.filter(game => game.substitutes && game.substitutes.some(s => s.playerRef === playerId && s.introducedOn));

const getGameById = (gameId) => games.find(g => g.id === gameId);

exports.getGameById = getGameById;
exports.getPlayerIntroductions = getPlayerIntroductions;
exports.getPlayerStarts = getPlayerStarts;
exports.getPlayerCaps = getPlayerCaps;
