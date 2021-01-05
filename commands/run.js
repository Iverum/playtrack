const Database = require('../db');
const trackGame = require('./track');
const untrackGame = require('./untrack');
const listGames = require('./list');

async function connect() {
  const db = new Database();
  await db.initialize();
  return db;
}

async function handleCommand(input, flags) {
  const gameName = input.slice(1).join(' ');
  const db = await connect();
  let response = null;
  switch (input[0]) {
    case 'add':
    case 'track':
      response = await trackGame(db, gameName, flags);
      break;
    case 'delete':
    case 'untrack':
      response = await untrackGame(db, gameName);
      break;
    case 'list':
      response = listGames(db);
      break;
    default:
      break;
  }
  db.close();
  return response;
}

module.exports = handleCommand;
