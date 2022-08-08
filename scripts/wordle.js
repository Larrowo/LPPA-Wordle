// Local json import
import PALABRAS from "/palabras.json" assert { type: "json" };

// Import functions from stopwatch.js
import { startTimer, stopTimer, resetTimer } from "./stopwatch.js";

//Global variables
const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

const targetWord = getRandomWord();
console.log(targetWord);
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const keyboard = document.querySelector("[data-keyboard]");

startInteraction();
startTimer();

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
 * TODO: Check if this works with the "if" statement for keys between
 * TODO: a-z is at the top if the function
 *
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

//TODO: ADD COMMENTS
function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

//TODO: ADD COMMENTS
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

//TODO: ADD COMMENTS
function showAlert(message, duration = 1000) {
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

//TODO: ADD COMMENTS
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

//TODO: ADD COMMENTS
function shakeTiles(tiles) {
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

//TODO: ADD COMMENTS
function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("¡You win!", 5000);
    danceTiles(tiles);
    stopInteraction();
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(
    ":not(.words-row):not([data-letter])"
  );
  console.log(remainingTiles);
  if (remainingTiles.length === 0) {
    showAlert("FRACASADO DEL ORTO", null);
    showAlert("The word was " + targetWord.toUpperCase(), null);
    stopInteraction();
  }
}

//TODO: ADD COMMENTS
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

function getRandomWord() {
  return PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
}
