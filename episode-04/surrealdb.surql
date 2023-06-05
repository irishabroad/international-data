SELECT 
  date,
  level.name AS level,
  homeTeam.country.name AS home,
  homeTeam.scored AS homeScored,
  awayTeam.country.name AS away,
  awayTeam.scored AS awayScored
FROM games
WHERE
  level.isCompetitive AND
  startingXI.player CONTAINS players:369
ORDER BY date ASC
LIMIT 1
