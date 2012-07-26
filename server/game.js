var Utils = require('./utils');

var Game = function(rows, cols, humanPlayer) {
    this.ROWS = rows;
    this.COLS = cols;

    this.gameOver = false;
    this.humanPlayer = humanPlayer;
    this.turn = Utils.Players.P1;
    this.moves = 0;
    this.moveList = [];
    this.lastMove = undefined;

    this.board = Utils.initBoard(
	this.ROWS,
	this.COLS,
	function() { return Utils.Players.EMPTY; }
    );
};

Game.prototype.getState = function() {
    // TODO: WML: NEEDED?
    return {
        rows: this.ROWS,
        cols: this.COLS,
        board: this.board,
        lastMove: this.lastMove,
        currentTurn: this.turn,
        moveNumber: this.moves
    };
};

Game.prototype.move = function() {
    if(this.gameOver) { 
	return; 
    }
     
    target = Utils.highestFilledRow(this.board, col) - 1;
    if(target >= 0) {
        this.moveList[this.moves] = col;
        this.moves = this.moves + 1;
        this.board[col][target] = this.turn;
        this.lastMove = { row: target, col: col, player: this.turn, moves: this.moves };
        this._advanceTurn();

        var winner = Utils.checkWin(this.board);
        if (winner) {
            this.gameOver = winner;
        }
    }
};

Game.prototype._advanceTurn = function() {
    if(this.turn == Utils.Players.P1) { this.turn = Utils.Players.P2 }
    else if(this.turn == Utils.Players.P2) { this.turn = Utils.Players.P1; }
};

exports.newGame = function(rows, cols, humanPlayer) {
    return new Game(rows, cols, humanPlayer);
};

