#!/usr/bin/env node
/* eslint-disable no-console */
const meow = require('meow');
const runCommand = require('./commands/run');

const cli = meow(`
  Add games to tracking:
    $ playtrack track <game>
    $ playtrack add <game>

    Options
      --setTime, -t
      Provide an ISO8601 formatted date to set the first played date on creation or the last played date on update

      --complete, -c
      Mark a game as completed

  Mark a game as complete:
    $ playtrack complete <game>

  Remove games from tracking:
    $ playtrack untrack <game>
    $ playtrack delete <game>

  List games:
    $ playtrack list
`, {
  booleanDefault: undefined,
  flags: {
    completed: {
      alias: 'c',
      default: false,
      type: 'boolean',
    },
    setTime: {
      alias: 't',
      default: '',
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
