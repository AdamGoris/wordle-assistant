'use strict';

import PuzzleState from './puzzle_state.js';

import readline from 'readline';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tries = 0;
let guessed_words = [];
let hints = [];
function recursiveAsyncReadLine () {
  if (tries >= 6) {
    console.log('LOL couldnt even win with hax');
    rl.close();
    return;
  }

  let try_string;
  switch (tries) {
    case (0):
      try_string = 'first';
      break;
    case (1):
      try_string = 'second';
      break;
    case (2):
      try_string = 'third';
      break;
    case (3):
      try_string = 'fourth';
      break;
    case (4):
      try_string = 'fifth';
      break;
    case (5):
      try_string = 'sixth';
      break;
  }

  rl.question(`Enter your ${try_string} guess: `, function (guess) {
    guessed_words.push(guess);
    rl.question('Enter your hint string: ', function (hint_str) {
      hints.push(hint_str);

      if (hint_str.toUpperCase() === 'GGGGG') {
        console.log('AYY congrats!');
        rl.close();
      }

      let puzzle_state = new PuzzleState(guessed_words, hints);
      puzzle_state.suggestWords();
      tries++;
      recursiveAsyncReadLine();
    });
  });
}

rl.on('close', function () {
  process.exit(0);
});

recursiveAsyncReadLine();
