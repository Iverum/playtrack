/* eslint-disable no-undef */
const Database = require('../../db');
const track = require('../track');

let db = null;
beforeEach(async () => {
  db = new Database(':memory:');
  await db.initialize();
});

test('fails when no db is provided', async () => {
  const response = await track(null, "Chip's Challenge");
  expect(response).toEqual('Could not find location to write to.');
});

test('fails when no game is provided', async () => {
  let response = await track(db, '');
  expect(response).toEqual('Please provide a game name to track.');
  response = await track(db, null);
  expect(response).toEqual('Please provide a game name to track.');
});

test('writes a game to the database', async () => {
  const response = await track(db, "Chip's Challenge");
  expect(response).toEqual("Tracked play of Chip's Challenge");
  const game = await db.get('SELECT name FROM games WHERE name = ?', ["Chip's Challenge"]);
  expect(game.name).toEqual("Chip's Challenge");
});

test('updates a game on conflict', async () => {
  let response = await track(db, "Chip's Challenge");
  expect(response).toEqual("Tracked play of Chip's Challenge");
  response = await track(db, "Chip's Challenge");
  expect(response).toEqual("Tracked play of Chip's Challenge");
});
