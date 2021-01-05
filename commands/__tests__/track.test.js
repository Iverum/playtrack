/* eslint-disable no-undef */
const moment = require('moment');
const Database = require('../../db');
const track = require('../track');

let db = null;
beforeEach(async () => {
  db = new Database(':memory:');
  await db.initialize();
});

test('fails when no db is provided', async () => {
  const response = await track(null, "Chip's Challenge");
  expect(response).toEqual('Could not find database.');
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

test('creates a game at the given timestamp when given a time flag', async () => {
  const response = await track(db, "Chip's Challenge", { setTime: '2012-07-05' });
  expect(response).toEqual("Tracked play of Chip's Challenge");
  const game = await db.get('SELECT createdAt, updatedAt FROM games WHERE name = ?', ["Chip's Challenge"]);
  expect(game.createdAt).toBe(parseInt(moment('2012-07-05').format('X'), 10));
  expect(game.updatedAt).toBe(parseInt(moment('2012-07-05').format('X'), 10));
});

test('creates a game with the given timestamp when given a time flag and conflicts', async () => {
  let response = await track(db, "Chip's Challenge");
  expect(response).toEqual("Tracked play of Chip's Challenge");
  response = await track(db, "Chip's Challenge", { setTime: '2012-07-05' });
  expect(response).toEqual("Tracked play of Chip's Challenge");
  const game = await db.get('SELECT updatedAt FROM games WHERE name = ?', ["Chip's Challenge"]);
  expect(game.updatedAt).toBe(parseInt(moment('2012-07-05').format('X'), 10));
});
