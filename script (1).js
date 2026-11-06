// Memory Card Game - vanilla JavaScript

const SYMBOLS = [
  "🍎", "🚀", "🎸", "🐳", "🌵", "🍕", "⚽", "🎲", "🦊", "🌈",
  "🍩", "🎧", "🐙", "🔥", "🍉", "🧩", "🦋", "🎯", "🍄", "🛸",
];

const LEVELS = {
  easy:   { cols: 4, pairs: 6 },
  medium: { cols: 4, pairs: 8 },
  hard:   { cols: 6, pairs: 15 },
};

const boardEl = document.getElementById("board");
const levelEl = document.getElementById("level");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");
const winDialog = document.getElementById("win");
const winText = document.getElementById("win-text");

let first = null;
let second = null;
let locked = false;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;
let seconds = 0;
let timerId = null;

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

function getBest(level) {
  try {
    return JSON.parse(localStorage.getItem("memory-best-" + level));
  } catch {
    return null;
  }
}

function saveBest(level, value) {
  try {
    localStorage.setItem("memory-best-" + level, JSON.stringify(value));
  } catch {
    /* storage unavailable, ignore */
  }
}

function showBest() {
  const best = getBest(levelEl.value);
  bestEl.textContent = best ? `${best.moves} moves` : "–";
}

function startTimer() {
  if (timerId) return;
  timerId = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function createCard(symbol) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "card";
  card.dataset.symbol = symbol;
  card.setAttribute("aria-label", "Hidden card");
  card.innerHTML = `
    <span class="inner">
      <span class="back"></span>
      <span class="front" aria-hidden="true">${symbol}</span>
    </span>`;
  card.addEventListener("click", () => flip(card));
  return card;
}

function newGame() {
  const { cols, pairs } = LEVELS[levelEl.value];

  stopTimer();
  first = second = null;
  locked = false;
  moves = 0;
  matchedPairs = 0;
  totalPairs = pairs;
  seconds = 0;
  movesEl.textContent = "0";
  timeEl.textContent = "0:00";
  showBest();

  const chosen = shuffle(SYMBOLS).slice(0, pairs);
  const deck = shuffle([...chosen, ...chosen]);

  boardEl.style.setProperty("--cols", cols);
  boardEl.innerHTML = "";
  deck.forEach((symbol) => boardEl.appendChild(createCard(symbol)));
}

function flip(card) {
  if (locked) return;
  if (card === first) return;
  if (card.classList.contains("matched")) return;

  startTimer();
  card.classList.add("flipped");
  card.setAttribute("aria-label", "Card " + card.dataset.symbol);

  if (!first) {
    first = card;
    return;
  }

  second = card;
  moves++;
  movesEl.textContent = moves;
  checkMatch();
}

function checkMatch() {
  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("matched");
    second.classList.add("matched");
    matchedPairs++;
    resetTurn();
    if (matchedPairs === totalPairs) win();
  } else {
    locked = true;
    setTimeout(() => {
      [first, second].forEach((c) => {
        c.classList.remove("flipped");
        c.setAttribute("aria-label", "Hidden card");
      });
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  first = second = null;
  locked = false;
}

function win() {
  stopTimer();
  const level = levelEl.value;
  const best = getBest(level);
  let message = `${moves} moves in ${formatTime(seconds)}.`;

  if (!best || moves < best.moves) {
    saveBest(level, { moves, seconds });
    message += " New best score!";
  }

  showBest();
  winText.textContent = message;
  setTimeout(() => winDialog.showModal(), 500);
}

document.getElementById("restart").addEventListener("click", newGame);
document.getElementById("play-again").addEventListener("click", () => {
  winDialog.close();
  newGame();
});
levelEl.addEventListener("change", newGame);

newGame();
