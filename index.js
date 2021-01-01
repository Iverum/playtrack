#!/usr/bin/env node
'use strict';
const meow = require('meow');
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
const INSERT_GAME = `INSERT INTO games (name) VALUES (?)`;
let db = null;

const cli = meow(`
  Usage
    $ playtrack <cmd> <args>
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
}

function handleCommand(input, flags) {
  setup();
  switch (input[0]) {
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
