SELECT
  *,
  (
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
      startingXI.player CONTAINS $parent.id
    ORDER BY date ASC
    LIMIT 1
  ) AS firstCompetitiveStart
FROM players
WHERE dateOfBirth != undefined
SPLIT firstCompetitiveStart
