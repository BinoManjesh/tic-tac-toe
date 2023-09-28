'use strict';

function GameBoard() {
    const board = Array(3);
    for (let i = 0; i < 3; ++i) {
        board[i] = Array(3);
        for (let j = 0; j < 3; ++j) {
            board[i][j] = 0;
        }
    }

    function checkDiag1() {
        if (!board[0][0]) {
            return false;
        }
        for (let i = 1; i < 3; ++i) {
            if (board[i][i] !== board[0][0]) {
                return false;
            }
        }
        return true;
    }

    function checkDiag2() {
        if (!board[2][0]) {
            return false;
        }
        for (let i = 1; i < 3; ++i) {
            if (board[i][2-i] !== board[0][2]) {
                return false;
            }
        }
        return true;
    }
    
    function checkRow(i) {
        if (!board[i][0]) {
            return false;
        }
        for (let j = 1; j < 3; ++j) {
            if (board[i][j] !== board[i][0]) {
                return false;
            }
        }
        return true;
    }

    function checkCol(j) {
        if (!board[0][j]) {
            return false;
        }
        for (let i = 1; i < 3; ++i) {
            if (board[i][j] !== board[0][j]) {
                return false;
            }
        }
        return true;
    }

    function isFull() {
        for (const row of board) {
            for (const cell of row) {
                if (cell === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function getState () {
        if (checkDiag1() || checkDiag2()) {
            return "win";
        }
        for (let i = 0; i < 3; ++i) {
            if (checkRow(i) || checkCol(i)) {
                return "win";
            }
        }
        if (isFull()) {
            return "tie";
        }
    }

    function doMove(row, col, turn) {
        board[row][col] = turn;
    }

    function isOccupied(row, col) {return board[row][col] !== 0} 

    return {doMove, isOccupied, getState};
}

function Game() {
    const gameBoard = GameBoard();
    let currentPlayer = 1;
    let gameOver = false;
    
    function playMove(row, col) {
        if (gameBoard.isOccupied(row, col) || gameOver) {
            return "invalid";
        }
        gameBoard.doMove(row, col, currentPlayer);

        const state = gameBoard.getState();
        if (state) {
            gameOver = true;
            return state;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    };

    function getCurrentPlayer() {return currentPlayer};

    return {playMove, getCurrentPlayer};
}

function DOMController() {
    let game = Game();
    const gameBoard = document.querySelector("div.game-board");
    const resultP = document.querySelector("p.result");
    const buttonGrid = Array(3);
    for (let i = 0; i < 3; ++i) {
        buttonGrid[i] = Array(3);
    }
    for (let i = 0; i < 9; ++i) {
        const button = document.createElement("button")
        button.className = "empty cell";
        button.dataset.row = Math.floor(i/3);
        button.dataset.col = i%3;
        buttonGrid[button.dataset.row][button.dataset.col] = button;
        gameBoard.appendChild(button);
    }

    function onClick(e) {
        if (!e.target.classList.contains("cell")) {
            return;
        }
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;
        const currentPlayer = game.getCurrentPlayer();
        const result = game.playMove(row, col);
        if (result === "invalid") {
            return;
        }
        buttonGrid[row][col].className =`player-${currentPlayer} cell`;
        if (result) {
            if (result === "tie") {
                resultP.textContent = "It's a Tie!";
            } else {
                resultP.textContent = `Player ${currentPlayer} wins!`;
            }
            resultP.removeAttribute("hidden");  
        }
    }

    gameBoard.addEventListener("click", onClick);
}

DOMController();
