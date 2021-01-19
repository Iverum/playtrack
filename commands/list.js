const columnify = require('columnify');
const moment = require('moment');

const GET_GAMES = 'SELECT name, createdAt, updatedAt, completed FROM games';
const GET_COMPLETED_GAMES = 'SELECT name, createdAt, updatedAt, completed FROM games WHERE completed = 1';

function formatTimestamp(ts) {
  const today = moment();
  const date = moment(ts, 'X');
  if (date.diff(today, 'day') === 0) {
    return date.fromNow();
  }

  return date.format('MMMM Do YYYY');
}

async function listGames(db, flags = {}) {
  if (!db) {
    return 'Could not find database.';
  }

  const query = flags.completed ? GET_COMPLETED_GAMES : GET_GAMES;
  const results = await db.query(query);
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
