const moment = require('moment');

const INSERT_GAME = `
  INSERT INTO games (name, completed, createdAt, updatedAt) VALUES ($name, $completed, $timestamp, $timestamp)
  ON CONFLICT(name) DO UPDATE SET updatedAt=$timestamp, completed=$completed;
`;

function getTimestamp(date) {
  if (!date) {
    return parseInt(moment().format('X'), 10);
  }

  return parseInt(moment(date).format('X'), 10);
}

async function trackGame(db, name, flags = {}) {
  if (!db) {
    return 'Could not find database.';
  }

  if (!name) {
    return 'Please provide a game name to track.';
  }

  const timestamp = getTimestamp(flags.setTime);
  const completed = flags.completed || false;
  await db.run(INSERT_GAME, { $name: name, $timestamp: timestamp, $completed: completed });
  return completed ? `Completed ${name}` : `Tracked play of ${name}`;
}

module.exports = trackGame;
