const fs = require('fs');
const sqlite = require('sqlite3').verbose();
const homedir = require('os').homedir();

const CREATE_TABLE = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    playtime INTEGER NOT NULL DEFAULT 0,
    completed INTEGER(1) NOT NULL DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  );
`;

const appDir = `${homedir}/.playtrack`;
const databasePath = `${appDir}/records.sqlite`;

class Database {
  constructor(path = databasePath) {
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(`${appDir}`);
    }
    this.db = new sqlite.Database(path);
  }

  get(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else resolve(row);
      });
    });
  }

  run(sql, params) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) {
          reject(err);
        } else resolve();
      });
    });
  }

  query(sql, params) {
    return new Promise((resolve, reject) => {
      const results = [];
      this.db.each(sql, params, (err, row) => {
        if (!err) {
          results.push(row);
        }
      }, (err) => {
        if (err) {
          reject(err);
        } else resolve(results);
      });
    });
  }

  close() {
    this.db.close();
  }

  async initialize() {
    await this.run(CREATE_TABLE);
  }
}

module.exports = Database;
