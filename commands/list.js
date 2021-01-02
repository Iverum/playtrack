const columnify = require('columnify');

const GET_GAMES = 'SELECT name, createdAt, updatedAt FROM games';

async function listGames(db) {
  if (!db) {
    return 'No games found.';
  }

  const results = await db.query(GET_GAMES);
  if (results.length <= 0) {
    return 'No games found.';
  }

  const games = results.map((r) => ({
    'first played': r.createdAt,
    'last played': r.updatedAt,
    name: r.name,
  }));
  return columnify(games, { columns: ['name', 'first played', 'last played'] });
}

module.exports = listGames;
