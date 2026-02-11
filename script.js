// Global variables
const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = [];
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let currentPlayer = "X";
let gameMode = "ai"; // "ai" or "multiplayer"
let playerNames = {
    X: "Player 1",
    O: "AI"
};

// DOM Elements
const welcomePage = document.getElementById("welcomePage");
const formPage = document.getElementById("formPage");
const gamePage = document.getElementById("gamePage");
const playerName1Input = document.getElementById("playerName1");
const playerName1MultiInput = document.getElementById("playerName1Multi");
const playerName2MultiInput = document.getElementById("playerName2Multi");
const singlePlayerForm = document.getElementById("singlePlayerForm");
const multiPlayerForm = document.getElementById("multiPlayerForm");
const player1Display = document.getElementById("player1Display");
const player2Display = document.getElementById("player2Display");

// Initialize the game board
function initializeBoard() {
    board.innerHTML = "";
    cells = [];
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
        cells.push(cell);
    }
    
    updatePlayerDisplays();
    statusText.textContent = "";
}

// Navigation functions
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => page.classList.remove("active"));
    
    const targetPage = document.getElementById(pageId);
    targetPage.classList.add("active");
    
    // Smooth transition
    setTimeout(() => {
        targetPage.style.display = "flex";
    }, 50);
}

// Initialize the welcome page on load
window.addEventListener("DOMContentLoaded", () => {
    // Event listeners for navigation
    document.getElementById("aiBtn").addEventListener("click", () => {
        gameMode = "ai";
        singlePlayerForm.classList.remove("hidden");
        multiPlayerForm.classList.add("hidden");
        showPage("formPage");
    });

    document.getElementById("multiplayerBtn").addEventListener("click", () => {
        gameMode = "multiplayer";
        singlePlayerForm.classList.add("hidden");
        multiPlayerForm.classList.remove("hidden");
        showPage("formPage");
    });

    document.getElementById("startSingleBtn").addEventListener("click", () => {
        const playerName = playerName1Input.value.trim() || "Player";
        playerNames.X = playerName;
        playerNames.O = "AI";
        startGame();
    });

    document.getElementById("startMultiBtn").addEventListener("click", () => {
        const player1Name = playerName1MultiInput.value.trim() || "Player 1";
        const player2Name = playerName2MultiInput.value.trim() || "Player 2";
        playerNames.X = player1Name;
        playerNames.O = player2Name;
        startGame();
    });

    document.getElementById("backBtn").addEventListener("click", () => {
        showPage("welcomePage");
    });

    document.getElementById("restartBtn").addEventListener("click", resetGame);
    document.getElementById("backToMenuBtn").addEventListener("click", () => {
        showPage("welcomePage");
    });
    
    showPage("welcomePage");
});

// Start game function
function startGame() {
    initializeBoard();
    showPage("gamePage");
}

// Update player displays
function updatePlayerDisplays() {
    if (gameMode === "ai") {
        player1Display.textContent = `${playerNames.X} (X)`;
        player2Display.textContent = `${playerNames.O} (O)`;
    } else {
        player1Display.textContent = `${playerNames.X} (X)`;
        player2Display.textContent = `${playerNames.O} (O)`;
    }
}

// Handle cell click based on game mode
function handleCellClick(e) {
    let index = parseInt(e.target.dataset.index);

    if (gameBoard[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (checkGameOver()) return;

    // Switch player in multiplayer mode, or trigger AI move in AI mode
    if (gameMode === "multiplayer") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `${playerNames[currentPlayer]}'s Turn`;
    } else {
        // AI move after a short delay
        setTimeout(aiMove, 500);
    }
}

// AI move logic
function aiMove() {
    if (!gameActive) return;
    
    let emptyCells = gameBoard
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (emptyCells.length > 0) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, "O");
        checkGameOver();
    }
}

// Make a move
function makeMove(index, player) {
    gameBoard[index] = player;
    cells[index].textContent = player;
    cells[index].dataset.player = player;
    
    // Update status for multiplayer
    if (gameMode === "multiplayer" && gameActive) {
        statusText.textContent = `${playerNames[player]}'s Turn`;
    }
}

// Check for game over (win or draw)
function checkGameOver() {
    // Check for win
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            gameBoard[a] &&
            gameBoard[a] === gameBoard[b] &&
            gameBoard[a] === gameBoard[c]
        ) {
            gameActive = false;
            
            // Show winner message
            if (gameMode === "ai") {
                if (gameBoard[a] === "X") {
                    statusText.textContent = `${playerNames.X} won the game!`;
                } else {
                    statusText.textContent = "AI won the game!";
                }
            } else {
                statusText.textContent = `${playerNames[gameBoard[a]]} won the game!`;
            }
            
            // Add win highlight effect
            setTimeout(() => {
                pattern.forEach(index => {
                    cells[index].classList.add('win');
                });
                
                // Add celebration effect
                createCelebrationEffect();
            }, 300);
            
            return true;
        }
    }

    // Check for draw
    if (!gameBoard.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        
        // Add draw effect to all cells
        setTimeout(() => {
            cells.forEach(cell => cell.classList.add('draw'));
        }, 300);
        
        return true;
    }

    return false;
}

// Create celebration effect
function createCelebrationEffect() {
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
        createConfettiParticle();
    }
    
    // Add celebration animation to the status text
    statusText.classList.add('celebration');
    
    // Remove celebration class after animation completes
    setTimeout(() => {
        statusText.classList.remove('celebration');
    }, 2000);
}

// Create a single confetti particle
function createConfettiParticle() {
    const particle = document.createElement('div');
    particle.className = 'confetti';
    
    // Random position
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = '-10px';
    
    // Random color
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Random size
    const size = Math.random() * 10 + 5;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    document.body.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

// Reset game function
function resetGame() {
    initializeBoard();
    statusText.textContent = `${playerNames.X}'s Turn`;
}

// Win patterns
const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

// Initialize the welcome page on load
window.addEventListener("DOMContentLoaded", () => {
    showPage("welcomePage");
});
