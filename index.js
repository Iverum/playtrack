#!/usr/bin/env node
/* eslint-disable no-console */
const meow = require('meow');
const runCommand = require('./commands/run');

const cli = meow(`
  Usage
    $ playtrack track <game>
`);

async function handleCommand(input) {
  const response = await runCommand(input);
  if (!response) {
    console.log(cli.help);
  } else {
    console.log(response);
  }
}

handleCommand(cli.input, cli.flags);
