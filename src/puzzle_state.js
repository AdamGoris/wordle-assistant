'use strict';

import { word_list, guessable_words } from './words.js';

class PuzzleState {
  constructor(word_list, hints_list) {
    if (word_list.length !== hints_list.length) {
      console.error('Error: word list and reveal list lengths differ');
    }

    this.state = [];

    for (let i = 0; i < word_list.length; i++) {
      if (word_list[i].length !== 5) {
        console.error(`Error: number of characters in word is not 5, got ${word_list[i].length}`);
      }

      this.state.push(
        { word: word_list[i], hints: hints_list[i].toUpperCase() }
      );
    }
  }

  suggestWords () {
    let knowledge = {
      does_not_contain: [], // array of letters not found in the solution (Black)
      contains_unknown_loc: [], // array of letters found in the solution with unknown position (Yellow)
      contains_known_loc: [] // array of letters found in the solution in correct position (Green)
    };

    console.log(this.state);

    // Loop over each row in the puzzle state
    for (let row of this.state) {
      for (let i = 0; i < row.word.length; i++) {
        let char = row.word.charAt(i);
        let hint = row.hints.charAt(i);

        if (hint === 'B') {
          // Check for duplicates first
          if (!knowledge.contains_known_loc.includes(char) && !knowledge.contains_unknown_loc.includes(char)) {
            knowledge.does_not_contain.push(char);
          }
        }

        if (hint === 'Y') {
          knowledge.contains_unknown_loc.push({ char: char, position: i });
        }

        if (hint === 'G') {
          knowledge.contains_known_loc.push({ char: char, position: i });
        }
      }
    }

    // Filter words that match the criteria of knowledge

    let potential_answers = word_list;
    let other_words_to_try = guessable_words;

    // Filter words that contain letters not in solution
    for (let not_contain of knowledge.does_not_contain) {
      potential_answers = potential_answers.filter(word => !word.includes(not_contain));
      other_words_to_try = other_words_to_try.filter(word => !word.includes(not_contain));
    }

    // Filter words that contain letter at location of unknown location letter
    let known_chars = knowledge.contains_known_loc.map(el => el.char);
    for (let unknown of knowledge.contains_unknown_loc) {
      potential_answers = potential_answers.filter(word => {
        if (word.charAt(unknown.position) === unknown.char) {
          if (known_chars.includes(unknown.char)) {
            return word;
          }
          return;
        }
        return word;
      });
      other_words_to_try = other_words_to_try.filter(word => {
        if (word.charAt(unknown.position) === unknown.char) {
          if (known_chars.includes(unknown.char)) {
            return word;
          }
          return;
        }
        return word;
      });
    }

    // Filter words that don't contain letter with unknown position
    for (let unknown of knowledge.contains_unknown_loc) {
      potential_answers = potential_answers.filter(word => word.includes(unknown.char));
      other_words_to_try = other_words_to_try.filter(word => word.includes(unknown.char));
    }

    // Filter by known positions
    for (let known of knowledge.contains_known_loc) {
      potential_answers = potential_answers.filter(word => word.charAt(known.position) === known.char);
      other_words_to_try = other_words_to_try.filter(word => word.charAt(known.position) === known.char);
    }

    console.log('Potential answers: ');
    console.log(potential_answers);
    console.log('Other words to try: ');
    console.log(other_words_to_try);
  }

}

export default PuzzleState;
