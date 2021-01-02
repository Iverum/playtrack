/* eslint-disable no-undef */
const Database = require('../../db');
const list = require('../list');

let db = null;
beforeEach(async () => {
  db = new Database(':memory:');
  await db.initialize();
});

test('fails when no db is provided', async () => {
  const response = await list(null);
  expect(response).toEqual('No games found.');
});

test('fails when no games are found', async () => {
  const response = await list(db);
  expect(response).toEqual('No games found.');
});

test('returns game results', async () => {
  await db.run(`
    INSERT INTO games (name)
    VALUES ("Metal Gear"), ("Metal Gear 2");
  `);
  const response = await list(db);
  expect(response).toMatchSnapshot();
});
