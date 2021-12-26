var board = Array(9).fill('');

const Player = (symbol, isCPU) => {
    const _symbol = symbol;
    const _isCPU = isCPU;
    const getSymbol = () => _symbol;
    return {
        isCPU: _isCPU,
        getSymbol
    }
}

const gameBoard = (() => {

    const isValid = (ind) => {
        return board[ind] === '';
    }

    const setItem = (ind, symbol) => {
        board[ind] = symbol;
        displayController.setSymbol(ind, symbol);
        // console.log(_board)
    }

    const getPositions = (newBoard, symbol) => {
        // get positions of symbol
        const indexes = newBoard.reduce((r, n, i) => {
            n === symbol && r.push(i);
            return r;
        }, []);
        return indexes
    }

    const availableMoves = (currentBoard) => {
        const indexes = currentBoard.reduce((a, e, i) => (e === '') ? a.concat(i) : a, [])
        return indexes
    }

    const clearArray = () => {
        board.fill('');
    }

    return {
        isValid,
        setItem,
        getPositions,
        clearArray,
        availableMoves
    }
})();

const gameController = (() => {

    var _numberOfTurns = 0;

    const playerOne = Player('X', false);
    const playerTwo = Player('O', true);

    const human = () => playerOne;
    const computer = () => playerTwo;

    const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 4, 8],
        [2, 4, 6],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    var _currentPlayer = playerOne;

    const getCurrentPlayer = () => _currentPlayer;
    const opposingPlayer = () => (_currentPlayer == playerOne) ? playerTwo : playerOne;

    const move = (ind) => {
        if (gameBoard.isValid(ind)) {
            _numberOfTurns += 1;
            gameBoard.setItem(ind, playerOne.getSymbol())

            if (playerTwo.isCPU) {
                gameBoard.setItem(ai.bestMove(), playerTwo.getSymbol());
            }
            // if (checkForWin(board, _currentPlayer.getSymbol())) {
            //     displayController.setDialog(`player ${_currentPlayer.getSymbol()} is the winner`);
            //     displayController.endgame(winningPositions[i]);
            //     resetGame()
            // } else if (checkForDraw()) {
            //     displayController.setDialog(`It's a draw!`)
            //     displayController.showReplay();
            //     resetGame()
            // } else {
            //     _currentPlayer = opposingPlayer();
            //     displayController.setDialog(`Player ${_currentPlayer.getSymbol()}'s turn.`)
            // }
        } else {
            console.log('invalid move')
        }
    }

    const checkForWin = (currentBoard, player) => {
        // console.log('checking for a win');
        const playerPositions = gameBoard.getPositions(currentBoard, player.getSymbol());
        for (let i = 0; i < winningPositions.length; i++) {
            if (playerPositions.length >= 3) {
                if (winningPositions[i].every(val => playerPositions.includes(val))) {
                    return true
                }
            }
        }
        return false
    }

    const checkForDraw = (currentBoard) => {
        return (gameBoard.availableMoves(currentBoard).length == 0);
    }

    const resetGame = () => {
        _numberOfTurns = 0;
        _currentPlayer = playerOne;
    }

    return {
        human,
        computer,
        getCurrentPlayer,
        move,
        checkForWin,
        checkForDraw
    }
})();

const ai = (() => {

    const minimax = (current, player, depth = 0) => {
        
        var emptySpots = gameBoard.availableMoves(current);

        if (gameController.checkForWin(current, gameController.human())) {
            return { score: -10 + depth }
        } else if (gameController.checkForWin(current, gameController.computer())) {
            return { score: 10 - depth }
        } else if (gameController.checkForDraw(current)) {
            return { score: 0 }
        }

        var bestMove = {};
        if (player == gameController.computer()) {
            var maxValue = -10000;
            for (let i = 0; i < emptySpots.length; i++) {
                current[emptySpots[i]] = player.getSymbol();
                var result = minimax(current, gameController.human(), depth + 1);
                current[emptySpots[i]] = '';

                if (result.score > maxValue) {
                    maxValue = result.score;
                    bestMove.score = maxValue;
                    bestMove.index = emptySpots[i];
                }
            }
            return bestMove;
        } else {
            var minValue = 10000;
            for (let i = 0; i < emptySpots.length; i++) {
                current[emptySpots[i]] = player.getSymbol();
                var result = minimax(current, gameController.computer(), depth + 1);
                current[emptySpots[i]] = '';

                if (result.score < minValue) {
                    minValue = result.score;
                    bestMove.score = minValue;
                    bestMove.index = emptySpots[i];
                }
            }
            return bestMove;
        }
    }

    const bestMove = () => {
        // let result = minimax(board, gameController.computer(), true).moves;
        // return result[Math.floor(Math.random() * moves.length)];
        return minimax(board, gameController.computer()).index;
    }

    return {
        minimax,
        bestMove
    }

})();

const displayController = (() => {
    var _squares = document.querySelectorAll('.square');
    const _dialog = document.getElementById('dialog');
    const _title = document.getElementById('title');

    const _container = document.getElementById('container');
    const _startgame = document.getElementById('startgame');
    const _replay = document.getElementById('replay');
    
    _squares.forEach((square, index) => {
        square.addEventListener('click', () => {
            gameController.move(index);
        });
    })

    _replay.addEventListener('click', (e) => {
        clearSquares();
        gameBoard.clearArray();
        e.target.style.opacity = 0;
        setDialog(`Player ${gameController.getCurrentPlayer().getSymbol()}'s turn.`)
    })

    _startgame.addEventListener('click', () => {
        _title.style.display = 'none';
        _container.style.display = 'flex';
        _container.style.visibility = 'visible';

        _startgame.style.display = 'none';
        setDialog(`Player ${gameController.getCurrentPlayer().getSymbol()}'s turn.`)
    })

    const setDialog = (text) => {
        _dialog.textContent = text
    }

    const setSymbol = (ind, symbol) => {
        console.log(ind, symbol)
        _squares[ind].innerHTML = symbol;
    }

    const clearSquares = () => {
        _squares.forEach(square => {
            square.style.backgroundColor = '';
            square.innerHTML = '';
            square.classList.remove('inactive');
        })
    }

    const endgame = (indexes) => {
        _squares.forEach((square, index) => {
            if (indexes.includes(index)) {
                _squares[index].style.backgroundColor = 'rgba(107, 203, 81, 0.728)';
            }
            square.classList.add('inactive');
        })
        showReplay();
    }

    const showReplay = () => {
        _replay.style.display = 'block';
        _replay.style.opacity = 1;
        _replay.style.visibility = 'visible';
    }

    return {
        setSymbol,
        endgame,
        setDialog,
        showReplay
    }
})();