const Database = require('../db');
const trackGame = require('./track');
const listGames = require('./list');

async function connect() {
  const db = new Database();
  await db.initialize();
  return db;
}

async function handleCommand(input) {
  const db = await connect();
  let response = null;
  switch (input[0]) {
    case 'list':
      response = listGames(db);
      break;
    case 'track':
      response = await trackGame(db, input.slice(1).join(' '));
      break;
    default:
      break;
  }
  db.close();
  return response;
}

module.exports = handleCommand;
