/* eslint-disable no-undef */
const Database = require('../../db');
const untrack = require('../untrack');

let db = null;
beforeEach(async () => {
  db = new Database(':memory:');
  await db.initialize();
});

test('fails when no db is provided', async () => {
  const response = await untrack(null, "Chip's Challenge");
  expect(response).toEqual('Could not find database.');
});

test('fails when no game is provided', async () => {
  let response = await untrack(db, '');
  expect(response).toEqual('Please provide a game name to delete.');
  response = await untrack(db, null);
  expect(response).toEqual('Please provide a game name to delete.');
});

test('writes a game to the database', async () => {
  const response = await untrack(db, "Chip's Challenge");
  expect(response).toEqual("Removed Chip's Challenge from tracking.");
  const game = await db.get('SELECT name FROM games WHERE name = ?', ["Chip's Challenge"]);
  expect(game).toBe(undefined);
});
