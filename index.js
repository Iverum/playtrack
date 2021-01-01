#!/usr/bin/env node
'use strict';
const meow = require('meow');
const columnify = require('columnify');
const fs = require('fs');
const sql = require('sqlite3').verbose();
const homedir = require('os').homedir();

const appDir = `${homedir}/.playtrack`;
const databasePath = `${appDir}/records.sqlite`;
const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    playtime INTEGER NOT NULL DEFAULT 0,
    completed INTEGER(1) NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;
const INSERT_GAME = `
  INSERT INTO games (name) VALUES (?)
  ON CONFLICT(name) DO UPDATE SET updatedAt=datetime('now');
`;
const GET_GAMES = `SELECT name, createdAt, updatedAt FROM games`
let db = null;

const cli = meow(`
  Usage
    $ playtrack track <game>
`);

function setup() {
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(`${appDir}`);
  }
  db = new sql.Database(databasePath);
  db.run(CREATE_TABLE);
};

function trackGame(name) {
  if (!name) {
    console.log("Please provide a game name to track.");
    return;
  }

  db.run(INSERT_GAME, [name]);
  console.log(`Tracked play of ${name}`);
}

function listGames() {
  const games = [];
  db.each(GET_GAMES, (err, row) => {
    if (err) {
      return;
    }
    games.push({ "first played": row.createdAt, "last played": row.updatedAt, name: row.name});
  }, (err) => {
    if (err) {
      console.log("Something went wrong.");
    } else {
      console.log(columnify(games, { columns: ["name", "first played", "last played"]}));
    }
  });
}

function handleCommand(input, flags) {
  setup();
  switch (input[0]) {
    case "list":
      listGames();
      break;
    case "track":
      trackGame(input.slice(1).join(" "));
      break;
    default:
      console.log(cli.help);
      break;
  }
  db.close();
};

handleCommand(cli.input, cli.flags);
