const SIZE = 9;
const MINES = 10;

let board = [];
let mineMap = [];
let revealed = [];
let flagged=[];

function initBoard() {
  const boardContainer = document.getElementById("board");
  boardContainer.innerHTML = "";
  boardContainer.style.display = "grid";
  boardContainer.style.gridTemplateColumns = `repeat(${SIZE}, 30px)`;
  boardContainer.style.gap = "2px";
  boardContainer.style.marginTop = "20px";

  board = [];
  mineMap = [];
  revealed = [];

  for (let i = 0; i < SIZE; i++) {
    board[i] = [];
    mineMap[i] = [];
    revealed[i] = [];
    flagged[i]=[];
    for (let j = 0; j < SIZE; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.style.width = "30px";
      cell.style.height = "30px";
      cell.style.border = "1px solid #999";
      cell.style.backgroundColor = "#ddd";
      cell.style.fontSize = "16px";
      cell.style.textAlign = "center";
      cell.style.lineHeight = "30px";
      cell.style.cursor = "pointer";
      cell.style.userSelect = "none";
      cell.addEventListener("click", handleClick);
      cell.addEventListener("contextmenu", handleRightClick);
      board[i][j] = cell;
      mineMap[i][j] = 0;
      revealed[i][j] = false;
      flagged[i][j]=false;
      boardContainer.appendChild(cell);
    }
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * SIZE);
    const c = Math.floor(Math.random() * SIZE);
    if (mineMap[r][c] === -1) continue;
    mineMap[r][c] = -1;
    placed++;

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && mineMap[nr][nc] !== -1) {
          mineMap[nr][nc]++;
        }
      }
    }
  }
}

function handleClick(e) {
  const r = parseInt(this.dataset.row);
  const c = parseInt(this.dataset.col);
  if (revealed[r][c]) return;

  if (mineMap[r][c] === -1) {
    this.textContent = "💣";
    this.style.backgroundColor = "red";
    revealAll();
    document.getElementById("status").textContent = "💥 Game Over!";
    return;
  }

  reveal(r, c);
  if (checkWin()) {
    revealAll();
    document.getElementById("status").textContent = "🎉 You win!";
  }
}

function reveal(r, c) {
  if (r < 0 || r >= SIZE || c < 0 || c >= SIZE || revealed[r][c]) return;

  revealed[r][c] = true;
  const cell = board[r][c];
  cell.style.backgroundColor = "#fff";
  cell.style.cursor = "default";

  const value = mineMap[r][c];
  if (value > 0) {
    cell.textContent = value;
  } else {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) reveal(r + dr, c + dc);
      }
    }
  }
}

function revealAll() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!revealed[r][c]) {
        revealed[r][c] = true;
        const cell = board[r][c];
        cell.style.backgroundColor = "#eee";
        if (mineMap[r][c] === -1) {
          cell.textContent = "💣";
          cell.style.backgroundColor = "red";
        } else if (mineMap[r][c] > 0) {
          cell.textContent = mineMap[r][c];
        }
      }
    }
  }
}

function checkWin() {
  let unrevealedCount = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!revealed[r][c]) unrevealedCount++;
    }
  }
  return unrevealedCount === MINES;
}

function handleRightClick(e) {
  e.preventDefault();
  const r = parseInt(this.dataset.row);
  const c = parseInt(this.dataset.col);

  if (revealed[r][c]) return;

  flagged[r][c] = !flagged[r][c];
  this.textContent = flagged[r][c] ? "🚩" : "";
}

document.addEventListener("DOMContentLoaded", initBoard);
