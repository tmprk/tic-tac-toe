const Player = (symbol) => {
    const _symbol = symbol
    const getSymbol = () => _symbol;
    return {
        getSymbol
    }
}

const gameBoard = (() => {
    const _board = Array(9);

    const isValid = (ind) => {
        return _board[ind] === undefined;
    }

    const setOnBoard = (ind, symbol) => {
        _board[ind] = symbol;
        displayController.setSymbol(ind, symbol);
        console.log(_board)
    }

    const getPositions = (symbol) => {
        // get positions of symbol
        const indexes = _board.reduce((r, n, i) => {
            n === symbol && r.push(i);
            return r;
        }, []);
        return indexes
    }

    const clearArray = () => {
        _board.fill(undefined);
    }

    return {
        isValid,
        setOnBoard,
        getPositions,
        clearArray
    }
})();

const gameController = (() => {
    var _numberOfTurns = 0;
    const playerOne = Player('X');
    const playerTwo = Player('O');

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
            gameBoard.setOnBoard(ind, _currentPlayer.getSymbol())
            
            if (checkForWin(_currentPlayer)) {
                displayController.setDialog(`player ${_currentPlayer.getSymbol()} is the winner`);
                resetGame()
            } else if (checkForDraw()) {
                displayController.setDialog(`It's a draw!`)
                displayController.showRestart();
                resetGame()
            } else {
                _currentPlayer = opposingPlayer();
                displayController.setDialog(`Player ${_currentPlayer.getSymbol()}'s turn.`)
            }
        } else {
            console.log('invalid move')
        }
    }

    const checkForWin = (player) => {
        console.log('checking for a win');
        const playerPositions = gameBoard.getPositions(player.getSymbol())
        console.log(playerPositions);
        
        for (let i = 0; i < winningPositions.length; i++) {
            if (playerPositions.length >= 3) {
                if (winningPositions[i].every(val => playerPositions.includes(val))) {
                    displayController.endgame(winningPositions[i]);
                    return true
                }
            }
        }
        return false
    }

    const checkForDraw = () => {
        return (_numberOfTurns > 8)
    }

    const resetGame = () => {
        _numberOfTurns = 0;
        _currentPlayer = playerOne;
    }

    return {
        getCurrentPlayer,
        move,
        checkForWin
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

    _replay.addEventListener('click', () => {
        clearBoard();
        gameBoard.clearArray();
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
        _squares[ind].innerHTML = symbol;
    }

    const clearBoard = () => {
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
        _replay.style.visibility = 'visible';
    }

    return {
        setSymbol,
        endgame,
        setDialog,
        showReplay
    }
})();