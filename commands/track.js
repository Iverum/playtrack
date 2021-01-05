const INSERT_GAME = `
  INSERT INTO games (name) VALUES (?)
  ON CONFLICT(name) DO UPDATE SET updatedAt=datetime('now');
`;

async function trackGame(db, name) {
  if (!db) {
    return 'Could not find database.';
  }

  if (!name) {
    return 'Please provide a game name to track.';
  }

  await db.run(INSERT_GAME, [name]);
  return `Tracked play of ${name}`;
}

module.exports = trackGame;
