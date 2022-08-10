//import functions from stopwatch.js
import { startTimer, resetTimer } from "./stopwatch.js";

const loadButton = document.querySelector("[data-load-button]");
const closeButton = document.querySelector("[data-close-button]");
const overlay = document.getElementById("overlay");
const guessGrid = document.querySelector("[data-guess-grid]");

/**
 * Event listener for "click" on load button
 */
loadButton.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.querySelector(loadButton.dataset.modalTarget);
  openModal(modal);
  testFunction();
});

function testFunction() {
  let savedGames = JSON.parse(localStorage.getItem("savedGames"));
  console.log(savedGames);

  let playerGames = [];
  savedGames.forEach((element) => {
    if (element.name === localStorage.userName) {
      playerGames.push(element);
    }
  });

  console.log(playerGames);
}

closeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = closeButton.closest(".modal");
  closeModal(modal);
});

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

function loadGame() {
  let savedGames = JSON.parse(localStorage.getItem("savedGames"));
  console.log(savedGames);

  let playerGames = [];
  savedGames.forEach((element) => {
    if (element.name === localStorage.userName) {
      playerGames.push(element);
    }
  });

  console.log(playerGames);

  for (let index = 0; index < game.words.length; index++) {
    const nextTile = guessGrid.querySelector(
      ":not(.words-row):not([data-letter])"
    );
    nextTile.dataset.letter = game.words[index];
    console.log(game.words[index]);
    nextTile.textContent = game.words[index];
    nextTile.dataset.state = game.states[index];
  }

  //TODO: FIX TIMER NOT WORKING WITH SECONDS > 60
  targetWord = game.targetWord;

  let timeLapsed = game.time.substring(3) * 1000;

  console.log(timeLapsed);
  resetTimer(0, game.time);
  startTimer(timeLapsed);
}
