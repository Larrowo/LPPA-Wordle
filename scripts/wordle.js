// Local json import
import PALABRAS from "/palabras.json" assert { type: "json" };

// Import functions from stopwatch.js
import { startTimer, stopTimer, resetTimer } from "./stopwatch.js";

//Global variables
const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

//random word from the JSON file
export let targetWord = getRandomWord();
console.log(targetWord);
// Get elements from DOM
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-keyboard]");
const playerName = document.querySelector("[data-player-name]");

//starts the interaction
startInteraction();
//resets the timer
startTimer(0);
//sets the player name that the user inputted on top of the grid
setPlayerName();

/**
 * Sets the player name that's saved in
 * the localStorage
 */
function setPlayerName() {
  playerName.innerHTML = localStorage.userName.toUpperCase();
}

/**
 * Starts the interaction with the game by adding
 * event listeners for click and keydown
 */
function startInteraction() {
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handlePress);
}

/**
 * Stops the interaction with the game by removing
 * event listeners from click and keydown
 */
function stopInteraction() {
  document.removeEventListener("click", handleClick);
  document.removeEventListener("keydown", handlePress);
}

/**
 * @param {*Event from startInteraction "eventListener"} e
 *
 * This function determines what happens
 * when the user clicks a key
 * on the keyboard
 */
function handleClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

/**
 * @param {*Event from startInteraction "eventListener"} e
 * This function determines what happens
 * when the user presses a key
 * on the keyboard
 */
function handlePress(e) {
  if (e.key.match(/^[a-zA-Z]$/)) {
    pressKey(e.key);
    return;
  }

  if (e.key === "Enter") {
    submitGuess();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }
}

/**
 * @param {*Key input from the handleClick and handlePress functions} key
 * This function adds the input from the user to the "tile" divs
 *
 * This function also stops the user from pressing
 * more keys when the amount of letter is equal
 * to the value of the WORD_LENGTH variable
 */
function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;
  const nextTile = guessGrid.querySelector(
    ":not(.words-row):not([data-letter])"
  );
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
}

/**
 *
 * Deletes the content of the last active tile
 *
 * reset it datasets
 */
function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

/**
 * submits the user inputs
 *
 * Validates if the inputs of the user are valid, if not, shows a message
 *
 */
function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
    shakeTiles(activeTiles);
    return;
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

  if (!PALABRAS.includes(guess)) {
    showAlert("Not in word list");
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction();
  activeTiles.forEach((...params) => flipTiles(...params, guess));
}

/**
 * Creates a div with a message informing the user of something
 *
 * @param {*a string that is going to be shown} message
 * @param {*the duration of the alert message, default is 1 second} duration
 * @returns
 */
export function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (!duration) return;
  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

/**
 * Set the state for each of the valid active tiles
 * and the keys of the keyboard
 *
 * adds a "flip" class for the animation of a valid input
 * and removes it to have a full animation
 *
 *
 * at the last tile it calls the checkWinLose to see
 * if the input matches the correct word
 *
 * @param {*The value of the tile} tile
 * @param {*the index of the array of tiles} index
 * @param {*the array of tiles} array
 * @param {*the input from the user} guess
 */
function flipTiles(tile, index, array, guess) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[data-key="${letter}"i]`);
  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * FLIP_ANIMATION_DURATION) / 2);

  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip");
    if (targetWord[index] === letter) {
      tile.dataset.state = "correct";
      key.classList.add("correct");
    } else if (targetWord.includes(letter)) {
      tile.dataset.state = "wrong-location";
      key.classList.add("wrong-location");
    } else {
      tile.dataset.state = "wrong";
      key.classList.add("wrong");
    }

    if (index === array.length - 1) {
      tile.addEventListener(
        "transitionend",
        () => {
          startInteraction();
          checkWinLose(guess, array);
        },
        { once: true }
      );
    }
  });
}

/**
 * It adds a "shake" class for the animations
 * and removes it when the animation ends
 *
 * @param {the active tiles that will be shaken when the input is not valid} tiles
 */
export function shakeTiles(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    );
  });
}

/**
 * Checks if the input of the user matches the target word, if it matches
 * it shows a message to the user
 *
 * if the user runs out of chances it ends the game with a message
 * the target word
 *
 * @param {*the word that the user inputted} guess
 * @param {*the tiles with the input} tiles
 * @returns
 */
function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("¡You win!", 5000);
    stopTimer();
    danceTiles(tiles);
    stopInteraction();
    return;
    localStorage.removeItem("");
  }

  const remainingTiles = guessGrid.querySelectorAll(
    ":not(.words-row):not([data-letter])"
  );

  if (remainingTiles.length === 0) {
    showAlert("FRACASADO DEL ORTO", null);
    showAlert("The word was " + targetWord.toUpperCase(), null);
    stopInteraction();
  }
}

/**
 * It adds a "dance" class for the animations
 * and removes it when the animation ends
 *
 * @param {the active tiles that will dance when the input matches the target word} tiles
 */
function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * DANCE_ANIMATION_DURATION) / 5);
  });
}

/**
 * @returns All the tiles that have the data attribute of "active""
 */
function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

/**
 *
 * @returns A random word from the JSON file
 */
function getRandomWord() {
  return PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
}
