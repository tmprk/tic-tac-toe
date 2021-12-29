# Tic Tac Toe **(and minimax algorithm)**

A responsive Tic-Tac-Toe game, part of the Javascript curriculum in Full Stack Javascript.

## Things to note

* The board is made using CSS grid
* Global variables are avoided as much as possible. Factory functions and the module pattern is used.
  * Private variables and functions are stored in each module, and can only be used publicly if it is returned in the object literal.
  * In the `gameBoard` object, an array of 9 positions is stored privately, yet this scope is maintained through the public functions of gameBoard.
* Every time a player makes a turn, their positions are checked against each of the winning positions.
* When 9 moves are reached without a winner, there is a draw.
* A minimax algorithm is implemented in its own module. It takes into account depth and will choose the shortest path to victory.

## To-do
- [ ] Select 1 or 2 player mode. Both work, but it's defaulted to playing with computer because minimax was recentlya added.

## Screenshots
Desktop             |  Mobile
:-------------------------:|:-------------------------:
![desktop](images/desktop.png)  |  ![modal](images/mobile.png)

## Demo

https://user-images.githubusercontent.com/49933688/147323820-10b40e5a-21c6-41b1-8739-87cac808def1.mov

A live preview of the site can be found [here](https://tmprk.github.io/tic-tac-toe/)
