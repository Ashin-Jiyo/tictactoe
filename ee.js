const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
let gameBoard = Array(9).fill(null);
const humanPlayer = 'X';
const aiPlayer = 'O';

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

cells.forEach(cell => cell.addEventListener('click', handleClick, false));
restartBtn.addEventListener('click', startGame);

function startGame() {
    gameBoard = Array(9).fill(null);
    cells.forEach(cell => {
        cell.innerText = '';
        cell.style.removeProperty('background-color');
        cell.addEventListener('click', handleClick, false);
    });
}

function handleClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (!gameBoard[index]) {
        makeMove(index, humanPlayer);
        if (!checkWin(gameBoard, humanPlayer) && !checkTie()) {
            setTimeout(() => makeMove(cheatMove(), aiPlayer), 500);
        }
    }
}

function makeMove(index, player) {
    gameBoard[index] = player;
    document.querySelector(`.cell[data-index='${index}']`).innerText = player;

    if (player === humanPlayer) {
        document.getElementById("humanSound").play();
    } else {
        document.getElementById("aiSound").play();
    }

    let gameWon = checkWin(gameBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;

    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index, player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.querySelector(`.cell[data-index='${index}']`).style.backgroundColor =
            gameWon.player === humanPlayer ? "blue" : "red";
    }
    cells.forEach(cell => cell.removeEventListener('click', handleClick, false));
    if (gameWon.player === humanPlayer) {
        document.getElementById("winSound").play();
    } else {
        document.getElementById("loseSound").pause();
    }
}

function emptySquares() {
    return gameBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);
}

function cheatMove() {
    let moves = emptySquares();
    if (moves.length > 1) {
        moves.pop(); // Let the human win by leaving the last move
    }
    return moves[Math.floor(Math.random() * moves.length)];
}

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', handleClick, false);
        });
        document.getElementById("drawSound").play();
        return true;
    }
    return false;
}

startGame();
