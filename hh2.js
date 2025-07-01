const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
let gameBoard = Array(9).fill(null);
const humanPlayer = 'X';
const aiPlayer = 'O';

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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
    makeMove(bestSpot(), aiPlayer); // AI starts first
}

function handleClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (!gameBoard[index]) {
        makeMove(index, humanPlayer);
        if (!checkWin(gameBoard, humanPlayer) && !checkTie()) {
            makeMove(bestSpot(), aiPlayer);
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
        document.getElementById("loseSound").play();
    }
}

function emptySquares() {
    return gameBoard.filter(s => s === null);
}

function bestSpot() {
    return minimax(gameBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        cells.forEach(cell => {
            cell.style.backgroundColor = "green";
            cell.removeEventListener('click', handleClick, false);
        });
        document.getElementById("loseSound").pause();
        document.getElementById("loseSound").currentTime = 0;
        document.getElementById("drawSound").play();
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let availSpots = newBoard.map((val, index) => val === null ? index : null).filter(val => val !== null);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function playSound() {
    let sound = document.getElementById("buttonSound");
    sound.play();
}

function playSound(page) {
    const sound = document.getElementById("buttonSound");
    sound.currentTime = 0;
    sound.play();

    setTimeout(() => {
        if (page) {
            window.location.href = page;
        } else {
            location.reload();
        }
    }, 500);
}

startGame();
