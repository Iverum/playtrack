const DELETE_GAME = `
  DELETE FROM games WHERE name = ?
`;

async function deleteGame(db, name) {
  if (!db) {
    return 'Could not find database.';
  }

  if (!name) {
    return 'Please provide a game name to delete.';
  }

  await db.run(DELETE_GAME, [name]);
  return `Removed ${name} from tracking.`;
}

module.exports = deleteGame;
