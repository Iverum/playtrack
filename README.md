## playtrack
> A simple CLI tool for tracking games you've played

This is just a little personal thing I built because I didn't want to use a Google Doc to track games I was playing and I decided to overcomplicate things.

### Install
`npm install -g playtrack`

```
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

    Options
      --complete, -c
      List only completed games
```
