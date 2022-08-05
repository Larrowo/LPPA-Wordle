// Local json import
import PALABRAS from "/palabras.json" assert { type: "json" };

const WORD_LENGTH = 5;
const targetWord = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
console.log(targetWord);
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");

startInteraction();

/**
 * Starts the interaction with the game by adding
 * event listeners from click and keydown
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
  if (e.key.match(/^[a-z]$/)) {
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

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (!lastTile) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

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

function flipTiles(tile, index, array, guess) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector('[data-key="${letter}]');
}

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

/**
 * @returns All the tiles that have the date attribute of "active""
 */
function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}
