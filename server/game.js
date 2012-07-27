var Utils = require('./utils');

var Game = function(rows, cols, humanPlayer, nickname, ai) {
    this.ROWS = rows;
    this.COLS = cols;

    this.gameOver = false;
    this.humanPlayer = humanPlayer;
    this.nickname = nickname;
    this.turn = Utils.Players.P1;
    this.moves = 0;
    this.moveList = [];
    this.lastMove = null;
    this.ai = ai;

    this.board = Utils.initBoard(
	this.ROWS,
	this.COLS,
	function() { return Utils.Players.EMPTY; }
    );
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

exports.newGame = function(rows, cols, humanPlayer, nickname, ai) {
    return new Game(rows, cols, humanPlayer, nickname, ai);
};
