var Utils = require('./utils');

var engine = {
    gameOver: false,
    
    /* returns object representation of current game state */
    gameState: function() {
        return {
            rows: engine.ROWS,
            cols: engine.COLS,
            board: engine.board,
            lastMove: engine.lastMove,
            currentTurn: engine.turn,
            moveNumber: engine.moves
        };
    },

    move: function(col) {
        if(engine.gameOver) { return; }
        target = Utils.highestFilledRow(engine.board, col) - 1;
        if(target >= 0) {
            engine.moveList[engine.moves] = col;
            engine.moves = engine.moves + 1;
            engine.board[col][target] = engine.turn;
            engine.lastMove = { row: target, col: col, player: engine.turn, moves: engine.moves };
            engine._advanceTurn();
            var winner = Utils.checkWin(engine.board);
            if(winner) {
                engine.gameOver = winner;
            }
        }
    },
        
    /* initialize everything */
    _init: function(rows, cols) {
        engine.ROWS = rows;
        engine.COLS = cols;
        engine.moves = 0;
        engine.moveList = [];
        engine.gameOver = false;
        engine.lastMove = undefined;
        
        engine.board = Utils.initBoard(rows, cols, function() { return Utils.Players.EMPTY; });
        engine.turn = Utils.Players.P1;
    },
    
    _advanceTurn: function() {
        if(engine.turn == Utils.Players.P1) { engine.turn = Utils.Players.P2 }
        else if(engine.turn == Utils.Players.P2) { engine.turn = Utils.Players.P1; }
    },
};

exports.newGame = function(rows, cols) {
    engine._init(rows, cols);
    return engine;
};

