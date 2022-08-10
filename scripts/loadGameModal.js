//import functions from stopwatch.js
import { startTimer, resetTimer } from "./stopwatch.js";
import { targetWord, modifyTargetWord } from "./wordle.js";

const loadButton = document.querySelector("[data-load-button]");
const closeButton = document.querySelector("[data-close-button]");
const overlay = document.getElementById("overlay");
const guessGrid = document.querySelector("[data-guess-grid]");
const node = document.getElementById("tableBody");

/**
 * Event listener for "click" on load button
 */
loadButton.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.querySelector(loadButton.dataset.modalTarget);
  openModal(modal);
  buildTable();
});

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
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  }
}

function loadGame(id) {
  let playerGames = [];
  console.log(id);

  JSON.parse(localStorage.getItem("savedGames")).forEach((element) => {
    if (element.name === localStorage.userName) {
      playerGames.push(element);
    }
  });
  let game;
  playerGames.forEach((element) => {
    if (element.id === id - 1) {
      game = element;
    }
  });
  console.log(game);

  clearTable();

  for (let index = 0; index < game.words.length; index++) {
    const nextTile = guessGrid.querySelector(
      ":not(.words-row):not([data-letter])"
    );
    nextTile.dataset.letter = game.words[index];
    console.log(game.words[index]);
    nextTile.textContent = game.words[index];
    nextTile.dataset.state = game.states[index];
  }

  modifyTargetWord(game.targetWord);

  //TODO: FIX TIMER NOT WORKING WITH SECONDS > 60
  let timeLapsed = game.time.substring(3) * 1000;

  resetTimer(0, game.time);
  startTimer(timeLapsed);
}

function buildTable() {
  let playerGames = [];
  JSON.parse(localStorage.getItem("savedGames")).forEach((element) => {
    if (element.name === localStorage.userName) {
      playerGames.push(element);
    }
  });
  console.log(playerGames);
  let table = document.getElementById("tableBody");

  for (var i = 0; i < playerGames.length; i++) {
    var row = `<tr class="game">
							<td>${playerGames[i].id}</td>
							<td>${playerGames[i].name}</td>
							<td>${playerGames[i].time}</td>
					  </tr>`;
    table.innerHTML += row;
  }

  let tr = [...document.getElementsByClassName("game")];
  tr.forEach((x) => {
    x.onclick = (e) => {
      let id = e.path[1].innerHTML.split(">")[1];
      id = id.toString().split("<")[0];
      loadGame(id);
      const modal = closeButton.closest(".modal");
      closeModal(modal);
    };
  });
}

function clearTable() {
  let activeTiles = [...guessGrid.querySelectorAll("[data-letter]")];
  console.log(activeTiles);

  activeTiles.forEach((element) => {
    element.textContent = "";
    delete element.dataset.state;
    delete element.dataset.letter;
  });
}
