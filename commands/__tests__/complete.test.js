/* eslint-disable no-undef */
const Database = require('../../db');
const complete = require('../complete');

let db = null;
beforeEach(async () => {
  db = new Database(':memory:');
  await db.initialize();
});

test('fails when no db is provided', async () => {
  const response = await complete(null, "Chip's Challenge");
  expect(response).toEqual('Could not find database.');
});

test('fails when no game is provided', async () => {
  let response = await complete(db, '');
  expect(response).toEqual('Please provide a game name to track.');
  response = await complete(db, null);
  expect(response).toEqual('Please provide a game name to track.');
});

test('writes a game to the database', async () => {
  const response = await complete(db, "Chip's Challenge");
  expect(response).toEqual("Completed Chip's Challenge");
  const game = await db.get('SELECT name, completed FROM games WHERE name = ?', ["Chip's Challenge"]);
  expect(game.name).toEqual("Chip's Challenge");
  expect(game.completed).toEqual(1);
});

test('updates a game on conflict', async () => {
  let response = await complete(db, "Chip's Challenge");
  expect(response).toEqual("Completed Chip's Challenge");
  response = await complete(db, "Chip's Challenge");
  expect(response).toEqual("Completed Chip's Challenge");
});
