let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let startContainer = document.querySelector(".start-container");
let playBtn = document.querySelector("#play-btn");
let aboutBtn = document.querySelector("#about-btn");
let popup = document.querySelector(".popup");
let closePopupBtn = document.querySelector("#close-popup");

let turnO = true; // playerX (User), playerO (AI)
let count = 0; // To track draw

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Show a draw message
const gameDraw = () => {
  msg.innerText = `Game was Draw.`;
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Disable boxes
const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

// Enable boxes
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

// Show winner message
const showWinner = (winner) => {
  if (winner === "O") {
    msg.innerText = `You Lose\n Scroll And Check The Result`;
  } else {
    msg.innerText = `Congratulations, Winner is ${winner}`;
  }
  msgContainer.classList.remove("hide");
  disableBoxes();
};

// Check for a winner
const checkWinner = (board, player) => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return true;
    }
  }
  return false;
};

// Minimax algorithm for AI
const minimax = (board, depth, isMaximizing) => {
  if (checkWinner(board, "O")) return 10 - depth;
  if (checkWinner(board, "X")) return depth - 10;
  if (!board.includes("")) return 0; // Tie

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// AI turn logic
const aiTurn = () => {
  let bestScore = -Infinity;
  let bestMove;

  let board = Array.from(boxes, (box) => box.innerText);

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== undefined) {
    // AI plays its turn
    boxes[bestMove].innerText = "O";
    boxes[bestMove].disabled = true;
    count++;

    // Update the board after AI's move
    let updatedBoard = Array.from(boxes, (box) => box.innerText);

    // Check for a winner after the AI's move
    if (checkWinner(updatedBoard, "O")) {
      setTimeout(() => {
        showWinner("O"); // AI won, display the winner message after a short delay
      }, 500); // Add a slight delay to show the winning move before displaying the message
    } else if (count === 9) {
      gameDraw();
    } else {
      turnO = true; // Switch back to player if no winner yet
    }
  }
};

// Event listener for player moves
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (turnO && box.innerText === "") {
      box.innerText = "X";
      box.disabled = true;
      count++;

      if (
        checkWinner(
          Array.from(boxes, (box) => box.innerText),
          "X"
        )
      ) {
        showWinner("X");
      } else if (count === 9) {
        gameDraw();
      } else {
        turnO = false;
        setTimeout(aiTurn, 500); // AI makes its move after a short delay
      }
    }
  });
});
// Go Back Btn
let goBackBtn = document.querySelector("#go-back-btn"); // Assign 'Go Back' button

// Event listener for "Go Back" button
goBackBtn.addEventListener("click", () => {
  // Hide the message container (if necessary)
  msgContainer.classList.add("hide");

  // Hide the game section
  document.querySelector(".game-container").classList.add("hide");

  // Show the start interface
  document.querySelector(".start-container").classList.remove("hide");

  // Optional: Reset the game if needed
  resetGame();
});

// Reset game button
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

// Show start container after loader
window.addEventListener("load", function () {
  setTimeout(function () {
    document.querySelector(".loader-container").style.display = "none";
    startContainer.classList.remove("hide");
  }, 7000); // 7 seconds delay for demonstration
});

// Start the game when Play button is clicked
playBtn.addEventListener("click", () => {
  startContainer.classList.add("hide");
  document.querySelector(".game-container").classList.remove("hide");
  resetGame(); // Call resetGame to start the game fresh
});

// Show about popup when About button is clicked
aboutBtn.addEventListener("click", () => {
  popup.classList.remove("hide");
});

// Close the popup
closePopupBtn.addEventListener("click", () => {
  popup.classList.add("hide");
});

// Service worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

let deferredPrompt;
const installBtn = document.createElement("button");
installBtn.textContent = "Download App";
installBtn.style.margin = "0%";
installBtn.classList.add("btn");
document.body.appendChild(installBtn);

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  installBtn.addEventListener("click", () => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      deferredPrompt = null;
    });
  });
});

// Optional: Hide the button after install
window.addEventListener("appinstalled", () => {
  installBtn.style.display = "none";
  console.log("App installed successfully");
});
