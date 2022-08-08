import { showAlert, shakeTiles, targetWord } from "./wordle.js";
import PALABRAS from "/palabras.json" assert { type: "json" };

const saveButton = document.querySelector("[data-save-button]");
const loadButton = document.querySelector("[data-load-button]");
const guessGrid = document.querySelector("[data-guess-grid]");
const stopwatch = document.querySelector("[data-stopwatch]");

saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  saveGame();
});

function getTilesForSave() {
  return guessGrid.querySelectorAll(
    '[data-state="active"], [data-state="wrong"], [data-state="wrong-location"], [data-state="correct"]'
  );
}

loadButton.addEventListener("click", (e) => {
  e.preventDefault();
  loadGame();
});

function saveGame() {
  let activeTiles = [...getTilesForSave()];

  console.log(activeTiles);
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
}

// function saveGameState() {
//     let file = {
//         user: user,
//         guessesRemaining: guessesRemaining,
//         rightGuessString: rightGuessString,
//         guessesMatrix: guessesMatrix,
//         colorMatrix: colorMatrix
//     }
//     let saveStateString = JSON.stringify(file)
//     localStorage.setItem(saveGame${user}, saveStateString)
// }

// var loadFile = JSON.parse(localStorage.getItem(saveGame${user}))
