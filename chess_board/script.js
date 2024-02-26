// JavaScript code
const board = document.getElementById("board");
const squares = [];
const queens = [];
const attackPaths = new Map(); // Store attack paths for each queen
let showAttackPaths = false; // Initially hide attack paths

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

    if (showAttackPaths) {
      // Remove attack path if count is zero
      const pathIndices = calculateAttackPath(row, col);
      updateAttackCounts(pathIndices, -1); // Decrease attack counts for the removed queen's path
      highlightOverlappingPaths(); // Highlight overlapping paths

      // Check if all queens have been removed and reset the button if so
      if (queens.length === 0) {
        toggleButton.textContent = "Show Attack Paths"; // Reset button text
      }
    }
  }
}

// Function to calculate attack path for a queen (horizontally, vertically, and diagonally)
function calculateAttackPath(row, col) {
  const pathIndices = [];
  // Mark column
  for (let i = 0; i < 8; i++) {
    if (i !== row) {
      const index = i * 8 + col;
      pathIndices.push(index);
    }
  }
  // Mark row
  for (let j = 0; j < 8; j++) {
    if (j !== col) {
      const index = row * 8 + j;
      pathIndices.push(index);
    }
  }
  // Mark diagonals
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i !== row && j !== col && Math.abs(i - row) === Math.abs(j - col)) {
        const index = i * 8 + j;
        pathIndices.push(index);
      }
    }
  }
  return pathIndices;
}

// Function to update attack counts for each square in the attack path
function updateAttackCounts(pathIndices, increment) {
  pathIndices.forEach((index) => {
    const key = `${Math.floor(index / 8)}-${index % 8}`;
    if (!attackPaths.has(key)) {
      attackPaths.set(key, 0);
    }
    const count = attackPaths.get(key) + increment;
    attackPaths.set(key, count);
    if (count === 0) {
      squares[index].classList.remove("attack-path");
    } else {
      squares[index].classList.add("attack-path");
    }
  });
}

// Function to highlight overlapping paths
function highlightOverlappingPaths() {
  const overlappingPaths = new Set(); // Set to store indices where paths overlap

  // Calculate attack paths for all queens and mark overlapping paths
  for (const queen of queens) {
    const queenPath = calculateAttackPath(queen.row, queen.col);
    queenPath.forEach((index) => {
      if (overlappingPaths.has(index)) {
        squares[index].classList.add("overlap-path"); // Add class for overlapping path
      } else {
        overlappingPaths.add(index);
      }
    });
  }

  // Remove "overlap-path" class from squares where there is no overlap
  squares.forEach((square, index) => {
    if (!overlappingPaths.has(index)) {
      square.classList.remove("overlap-path");
    }
  });
}

// Function to toggle attack path visibility
function toggleAttackPaths() {
  showAttackPaths = !showAttackPaths;
  if (showAttackPaths) {
    // Show attack paths for all queens
    queens.forEach((queen) => {
      const pathIndices = calculateAttackPath(queen.row, queen.col);
      updateAttackCounts(pathIndices, 1); // Increase attack counts for each queen's path
    });
    highlightOverlappingPaths(); // Highlight overlapping paths
    toggleButton.textContent = "Hide Attack Paths"; // Change button text
    resetButton.classList.remove("hidden"); // Show the reset button
  } else {
    // Hide attack paths for all queens
    queens.forEach((queen) => {
      const pathIndices = calculateAttackPath(queen.row, queen.col);
      updateAttackCounts(pathIndices, -1); // Decrease attack counts for each queen's path
    });
    attackPaths.clear();
    squares.forEach((square) => {
      square.classList.remove("attack-path", "overlap-path");
    });
    toggleButton.textContent = "Show Attack Paths"; // Change button text
  }
}

// Function to reset the chessboard to its initial state
function resetBoard() {
  queens.splice(0); // Clear queens array
  attackPaths.clear(); // Clear attack paths
  squares.forEach((square) => {
    square.innerHTML = ""; // Remove queen icons
    square.classList.remove("queen", "attack-path", "overlap-path"); // Remove queen and attack path classes
  });
  toggleButton.classList.add("hidden"); // Hide the toggle button
  resetButton.classList.add("hidden"); // Hide the reset button
  showAttackPaths = false; // Set attack path visibility to false
  toggleButton.textContent = "Show Attack Paths"; // Reset button text
}

// Add event listener to the toggle button
const toggleButton = document.getElementById("toggleButton");
toggleButton.addEventListener("click", toggleAttackPaths);

// Add event listener to the reset button
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", resetBoard);

// Add event listener to each square to place or remove queens
squares.forEach((square, index) => {
  const row = Math.floor(index / 8);
  const col = index % 8;
  square.addEventListener("click", () => {
    const existingQueen = queens.find((q) => q.row === row && q.col === col);
    if (existingQueen) {
      // If there's already a queen on this square, remove it
      removeQueen(row, col);
    } else if (isValidConfiguration({ row, col })) {
      // If it's a valid position, place a queen
      placeQueen(row, col);
      toggleButton.classList.remove("hidden"); // Show the toggle button after placing the queen
      resetButton.classList.remove("hidden"); // Show the reset button after placing the queen
    } else {
      // Otherwise, indicate it cannot be placed
      console.log("Cannot place queen in this position.");
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
