"use strict";

var Utils = require('./utils');

var Game = function(rows, cols, challengerPlayer, nickname, aiLevel, isPlayingManually) {
    this.ROWS = rows;
    this.COLS = cols;

    this.gameOver = 0;
    this.challengerPlayer = challengerPlayer;
    this.nickname = nickname;
    this.turn = Utils.Players.P1;
    this.moves = 0;
    this.moveList = [];
    this.lastMove = null;
    this.aiLevel = aiLevel;
    this.isPlayingManually = isPlayingManually;

    this.board = Utils.initBoard(
        this.ROWS,
        this.COLS,
        function() { return Utils.Players.EMPTY; }
    );
};

Game.prototype.move = function(col) {
    if(this.gameOver > 0) { 
        return { failed: true, message: "The game has ended already" }; 
    }
    if(!Utils.isLegalMove(this.board, col)) {
        this.gameOver = this._advanceTurn(this.turn);
        return { failed: true, message: "(" + col + ") is an invalid move" };
    }
     
    var target = Utils.highestFilledRow(this.board, col) - 1;
    if(target >= 0) {
        this.moveList[this.moves] = col;
        this.moves = this.moves + 1;
        this.board[col][target] = this.turn;
        this.lastMove = { row: target, col: col, player: this.turn, moves: this.moves };
        this.turn = this._advanceTurn(this.turn);

        var winner = Utils.checkWin(this.board);
        if (winner) {
            this.gameOver = winner;
        }
        return { failed: false };
    }

    this.gameOver = this._advanceTurn(this.turn);
    return { failed: true, message: "(" + col + ") is an invalid move" };
};

Game.prototype._advanceTurn = function(currentTurn) {
    if(currentTurn == Utils.Players.P1) { return Utils.Players.P2; }
    else if(currentTurn == Utils.Players.P2) { return Utils.Players.P1; }
};

exports.deserialize = function(game) {
    var that = new Game(game.ROWS, game.COLS, game.challengerPlayer, game.nickname, game.aiLevel, game.isPlayingManually);
    that.gameOver = game.gameOver;
    that.turn = game.turn;
    that.moves = game.moves;
    that.moveList = game.moveList;
    that.lastMove = game.lastMove;
    that.board = game.board;
    that.id = game.id;
    return that;
};

exports.newGame = function(rows, cols, challengerPlayer, nickname, aiLevel, isPlayingManually) {
    return new Game(rows, cols, challengerPlayer, nickname, aiLevel, isPlayingManually);
};
