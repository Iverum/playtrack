#!/usr/bin/env node
/* eslint-disable no-console */
const meow = require('meow');
const runCommand = require('./commands/run');

const cli = meow(`
  Add games to tracking:
    $ playtrack track <game>
    $ playtrack add <game>

  Remove games from tracking:
    $ playtrack untrack <game>
    $ playtrack delete <game>

  List games:
    $ playtrack list
`, {
  booleanDefault: undefined,
  flags: {
    setTime: {
      alias: 't',
      default: undefined,
      type: 'string',
    },
  },
});

async function handleCommand(input, flags) {
  const response = await runCommand(input, flags);
  if (!response) {
    console.log(cli.help);
  } else {
    console.log(response);
  }
}

handleCommand(cli.input, cli.flags);
