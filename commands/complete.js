const COMPLETE_GAME = `
  INSERT INTO games (name, completed) VALUES ($name, 1)
  ON CONFLICT(name) DO UPDATE SET completed=1;
`;

async function completeGame(db, name) {
  if (!db) {
    return 'Could not find database.';
  }

  if (!name) {
    return 'Please provide a game name to track.';
  }

  await db.run(COMPLETE_GAME, { $name: name });
  return `Completed ${name}`;
}

module.exports = completeGame;
