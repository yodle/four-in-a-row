"use strict";

var Utils = require('../utils');
var assert = require('assert');

module.exports = {
    'Highest filled row on empty board is 0': function() {
        var board = [[]];
        assert.equal(0, Utils.highestFilledRow(board, 0));
    },
    
    'Highest filled row on empty column is column length': function() {
        var board = [[0,0,0]];
        assert.equal(3, Utils.highestFilledRow(board, 0));
    },
    
    'Highest filled row on column with single piece is length-1': function() {
        var board = [[0,0,1]];
        assert.equal(2, Utils.highestFilledRow(board, 0));
    },
    
    'Highest filled row on full column is 0': function() {
        var board = [[1,1,1]];
        assert.equal(0, Utils.highestFilledRow(board, 0));
    },

    'no move on an empty board is legal': function() {
        var board = [[]];
        assert.equal(false, Utils.isLegalMove(board, 0));
    },
    
    'move on an empty column is legal': function() {
        var board = [[0,0,0]];
        assert.equal(true, Utils.isLegalMove(board, 0));
    },
    
    'move on a full column is illegal': function() {
        var board = [[1,1,1]];
        assert.equal(false, Utils.isLegalMove(board, 0));
    },
    
    'move on an out of bounds column is illegal': function() {
        var board = [[0,0,0]];
        assert.equal(false, Utils.isLegalMove(board, 1));
    },
    
    'Init board with size 0 returns []': function() {
        assert.deepEqual([], Utils.initBoard(0,0));
    },
    
    'Init board with 0 rows returns [[]]': function() {
        assert.deepEqual([[]], Utils.initBoard(0,1));
    },
    
    'Init board with 0 cols returns []': function() {
        assert.deepEqual([], Utils.initBoard(1,0));
    },
    
    'Init board fills cell with desired function value': function() {
        var fillFn = function(row,col) { return [row,col]; };
        var board = Utils.initBoard(1,1,fillFn);
        assert.deepEqual([0,0], board[0][0]);
    },
    
    'Check win on empty board returns a tie': function() {
        assert.equal('tie', Utils.checkWin([]));
    },
    
    'Check win with 4 in a single column returns player who won': function() {
        var board = [[1,1,1,1]];
        assert.equal(1, Utils.checkWin(board));
    },
    
    'Check win with 4 in a single rows returns player who won': function() {
        var board = [[1],[1],[1],[1]];
        assert.equal(1, Utils.checkWin(board));
    },
    
    'Check win with 4 in a left-to-right diagonal returns player who won': function() {
        var board = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
        assert.equal(1, Utils.checkWin(board));
    },
    
    'Check win with 4 in a right-to-left diagonal returns player who won': function() {
        var board = [[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]];
        assert.equal(1, Utils.checkWin(board));
    },
    
    'Check win on a full board returns a tie': function() {
        var board = [[1,1,1,2],[2,2,2,1]];
        assert.equal('tie', Utils.checkWin(board));
    },
    
    /* Check all other tetrominos fail */
    'Check win with a J returns false': function() {
        var board = [[0,0,0,0],
                 [0,0,1,0],
                 [0,0,1,0],
                 [0,1,1,0]];
        assert.equal(false, Utils.checkWin(board));
    },
    
    'Check win with an L returns false': function() {
        var board = [[0,0,0,0],
                 [0,1,0,0],
                 [0,1,0,0],
                 [0,1,1,0]];
        assert.equal(false, Utils.checkWin(board));
    },
    
    'Check win with an O returns false': function() {
        var board = [[0,0,0,0],
                 [0,0,0,0],
                 [0,1,1,0],
                 [0,1,1,0]];
        assert.equal(false, Utils.checkWin(board));    
    },
    
    'Check win with an S returns false': function() {
        var board = [[0,0,0,0],
                 [0,1,0,0],
                 [0,1,1,0],
                 [0,0,1,0]];
        assert.equal(false, Utils.checkWin(board));    
    },
    
    'Check win with a Z returns false': function() {
        var board = [[0,0,0,0],
                 [0,0,1,0],
                 [0,1,1,0],
                 [0,1,0,0]];
        assert.equal(false, Utils.checkWin(board));
    },
    
    'Check win with a T returns false': function() {
        var board = [[0,0,0,0],
                 [0,0,0,0],
                 [0,1,0,0],
                 [1,1,1,0]];
        assert.equal(false, Utils.checkWin(board));
    }
};
