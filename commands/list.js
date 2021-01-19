const columnify = require('columnify');
const moment = require('moment');

const GET_GAMES = 'SELECT name, createdAt, updatedAt, completed FROM games';

function formatTimestamp(ts) {
  const today = moment();
  const date = moment(ts, 'X');
  if (date.diff(today, 'day') === 0) {
    return date.fromNow();
  }

  return date.format('MMMM Do YYYY');
}

async function listGames(db) {
  if (!db) {
    return 'Could not find database.';
  }

  const results = await db.query(GET_GAMES);
  if (results.length <= 0) {
    return 'No games found.';
  }

  const games = results.map((r) => ({
    completed: r.completed ? '\u2713' : '\u2717',
    'first played': formatTimestamp(r.createdAt),
    'last played': formatTimestamp(r.updatedAt),
    name: r.name,
  }));
  return columnify(games, { columns: ['name', 'first played', 'last played', 'completed'], minWidth: 30 });
}

module.exports = listGames;
