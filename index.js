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

    return {
        isValid,
        setOnBoard,
        getPositions
    }
})();

const gameController = (() => {
    const playerOne = Player('X');
    const playerTwo = Player('O');

    const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
    ]

    var _currentPlayer = playerOne;
    const move = (ind) => {
        if (gameBoard.isValid(ind)) {
            gameBoard.setOnBoard(ind, _currentPlayer.getSymbol())

            checkForWin(_currentPlayer);
            _currentPlayer = (_currentPlayer == playerOne) ? playerTwo : playerOne;
        } else {
            console.log('invalid move')
        }
    }

    const checkForWin = (player) => {
        console.log('checking for win');
        const playerPositions = gameBoard.getPositions(player.getSymbol())
        console.log(playerPositions);
        if (winningPositions.includes(playerPositions)) {
            console.log(`player ${player.getSymbol()} is the winner`)
        }
    }

    return {
        move,
        checkForWin
    }
})();

const displayController = (() => {
    var _squares = document.querySelectorAll('.square');
    
    _squares.forEach((element, index) => {
        element.addEventListener('click', () => {
            gameController.move(index);
        });
    })

    const setSymbol = (ind, symbol) => {
        _squares[ind].innerHTML = symbol;
    }

    return {
        setSymbol
    }
})();