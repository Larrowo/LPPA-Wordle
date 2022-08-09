//import functions from wordle.js
import { showAlert, shakeTiles, targetWord } from "./wordle.js";
//import local JSON file
import PALABRAS from "/palabras.json" assert { type: "json" };
//import functions from stopwatch.js
import { startTimer, resetTimer } from "./stopwatch.js";

//get elements from DOM
const saveButton = document.querySelector("[data-save-button]");
const loadButton = document.querySelector("[data-load-button]");
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
 * Event listener for "click" on load button
 */
loadButton.addEventListener("click", (e) => {
  e.preventDefault();
  loadGame();
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
  let activeTiles = [...getTilesForSave()];

  const words = [];
  const states = [];
  for (let index = 0; index < activeTiles.length; index++) {
    words[index] = activeTiles[index].innerHTML;
    states[index] = activeTiles[index].dataset.state;
  }
  console.log(words);
  console.log(states);

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

  const remainingTiles = guessGrid.querySelectorAll(
    ":not(.words-row):not([data-letter])"
  );

  console.log(remainingTiles.length);

  let file = {
    name: localStorage.userName,
    words: words,
    states: states,
    time: stopwatch.innerHTML,
    targetWord: targetWord,
  };

  console.log(file);

  if (activeTiles.length === 0) {
    showAlert("You can't save an empty attempt");
  } else if (!PALABRAS.includes(guess)) {
    showAlert("You can't save a word that's not included");
    shakeTiles(activeTiles);
  } else {
    localStorage.setItem("savedGame", JSON.stringify(file));
  }
}

function loadGame() {
  let file = JSON.parse(localStorage.getItem("savedGame"));

  for (let index = 0; index < file.words.length; index++) {
    const nextTile = guessGrid.querySelector(
      ":not(.words-row):not([data-letter])"
    );
    nextTile.dataset.letter = file.words[index];
    console.log(file.words[index]);
    nextTile.textContent = file.words[index];
    nextTile.dataset.state = file.states[index];
  }

  targetWord = file.targetWord;

  let timeLapsed = file.time.substring(3) * 1000;

  console.log(timeLapsed);
  resetTimer(0, file.time);
  startTimer(timeLapsed);
}
