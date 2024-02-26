// JavaScript code
const board = document.getElementById("board");
const squares = [];
const queens = [];

// Create the chessboard
for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");
  square.classList.add("square");
  squares.push(square);
  board.appendChild(square);
}

// Function to place a queen on the board
function placeQueen(row, col) {
  queens.push({ row, col });
  const index = row * 8 + col;
  squares[index].innerHTML = "&#9813;"; // Queen Unicode character
  squares[index].classList.add("queen");
}

// Function to remove a queen from the board
function removeQueen(row, col) {
  const existingQueenIndex = queens.findIndex(
    (q) => q.row === row && q.col === col
  );
  if (existingQueenIndex !== -1) {
    const removedQueen = queens.splice(existingQueenIndex, 1)[0];
    const index = row * 8 + col;
    squares[index].innerHTML = ""; // Remove queen icon from the square
    squares[index].classList.remove("queen");
  }
}

// Function to display temporary message on screen
function showTemporaryMessage(message, duration = 2000) {
  const tempMessage = document.createElement("div");
  tempMessage.textContent = message;
  tempMessage.classList.add("temp-message");
  document.body.appendChild(tempMessage);
  setTimeout(() => {
    tempMessage.remove();
  }, duration);
}

// Add event listener to each square to place or remove queens
squares.forEach((square, index) => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  square.addEventListener("click", () => {
    const existingQueen = queens.find((q) => q.row === row && q.col === col);
    if (existingQueen) {
      // If there's already a queen on this square, remove it
      removeQueen(row, col);
      showTemporaryMessage("Queen removed.");
    } else if (isValidConfiguration({ row, col })) {
      // If it's a valid position, place a queen
      placeQueen(row, col);
    } else {
      // Otherwise, indicate it cannot be placed
      showTemporaryMessage("Cannot place queen in this position.");
    }
  });
});

// Function to check if a queen position is under attack
function isUnderAttack(queen, queens) {
  for (const otherQueen of queens) {
    if (queen !== otherQueen && canAttack(queen, otherQueen)) {
      return true;
    }
  }
  return false;
}

// Function to check if the board configuration is valid
function isValidConfiguration(newQueen) {
  for (const queen of queens) {
    if (isUnderAttack(newQueen, queens)) {
      return false;
    }
  }
  return true;
}

// Function to check if two queens can attack each other
function canAttack(queen1, queen2) {
  return (
    queen1.row === queen2.row ||
    queen1.col === queen2.col ||
    Math.abs(queen1.row - queen2.row) === Math.abs(queen1.col - queen2.col)
  );
}
