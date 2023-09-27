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
        if (isFull()) {
            return "tie";
        }
        if (checkDiag1() || checkDiag2()) {
            return "win";
        }
        for (let i = 0; i < 3; ++i) {
            if (checkRow(i) || checkCol(i)) {
                return "win";
            }
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
            return;
        }
        gameBoard.doMove(row, col, currentPlayer);

        const state = gameBoard.getState();
        if (state) {
            gameOver = true;
            if (state === 'tie') {
                return state;
            }
            return currentPlayer;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
    };

    return {playMove};
}
