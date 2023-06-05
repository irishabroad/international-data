SELECT *
FROM games
WHERE
  level.isCompetitive AND
  startingXI.player CONTAINS players:369
