SELECT 
  date,
  level.name,
  homeTeam.country.name,
  homeTeam.scored,
  awayTeam.country.name,
  awayTeam.scored
FROM games
WHERE
  level.isCompetitive AND
  startingXI.player CONTAINS players:369
ORDER BY date ASC
LIMIT 1
