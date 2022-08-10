//import functions from wordle.js
import { showAlert, shakeTiles, targetWord } from "./wordle.js";
//import local JSON file
import PALABRAS from "/palabras.json" assert { type: "json" };

//get elements from DOM
const saveButton = document.querySelector("[data-save-button]");
const guessGrid = document.querySelector("[data-guess-grid]");
const stopwatch = document.querySelector("[data-stopwatch]");

/**
 * Event listener for "click" on save button
 */
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  saveGame();
});

/**
 *
 * @returns the list of tiles that have one of the mentioned states
 */
function getTilesForSave() {
  return guessGrid.querySelectorAll(
    '[data-state="active"], [data-state="wrong"], [data-state="wrong-location"], [data-state="correct"]'
  );
}

/**
 * This functions saves the state of the game
 * and validates if the game can be save with the
 * inputs given by the player
 *
 *
 * saves the letters and the states of each letter in 2 arrays
 *
 * Also stores the name of the player, the time past and the winning
 * word in that moment
 */
function saveGame() {
  let savedGames = [];
  if (JSON.parse(localStorage.savedGames)) {
    savedGames = JSON.parse(localStorage.savedGames);
  }
  let activeTiles = [...getTilesForSave()];

  const words = [];
  const states = [];
  for (let index = 0; index < activeTiles.length; index++) {
    words[index] = activeTiles[index].innerHTML;
    states[index] = activeTiles[index].dataset.state;
  }
  console.log(words);
  console.log(states);

  let guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

  if (guess.length > 5) {
    guess = guess.slice(-5);
  }

  console.log(guess);
  console.log(guess.length);
  const remainingTiles = guessGrid.querySelectorAll(
    ":not(.words-row):not([data-letter])"
  );

  if (activeTiles.length === 0) {
    showAlert("You can't save an empty attempt");
  } else if (!PALABRAS.includes(guess)) {
    showAlert("You can't save a word that's not included");
    shakeTiles(activeTiles);
  } else {
    let file = {
      name: localStorage.userName,
      words: words,
      states: states,
      time: stopwatch.innerHTML,
      targetWord: targetWord,
    };

    savedGames.push(file);
    console.log(file);
    localStorage.setItem("savedGames", JSON.stringify(savedGames));
  }
}
