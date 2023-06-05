SELECT
  string::concat(firstName, ' ', surName) AS name,
  time::format(dateOfBirth, '%A, %d %B %Y') AS dateOfBirth,
  time::format(firstCompetitiveStart.date, '%A, %d %B %Y') AS date,
  (firstCompetitiveStart.date - dateOfBirth) AS age,
  firstCompetitiveStart.level AS level,
  firstCompetitiveStart.home AS home,
  string::concat(firstCompetitiveStart.homeScored, '-', firstCompetitiveStart.awayScored) AS score,
  firstCompetitiveStart.away AS away
FROM (
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
)
ORDER BY age ASC
LIMIT 20
