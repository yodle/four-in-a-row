var Players = {
    EMPTY: 0,
    P1: 1,
    P2: 2
}    
exports.Players = Players;

var check = function(row, col, board, test, accumulator) {
    if(board[col][row] == Players.EMPTY) { return 0; }
    else if(test(row, col)) { return accumulator(row, col); }
    else { return 1; } 
};
    
var checker = {
    cols: function(row, col, board, checkBoard) {
        if(row == 0) { return 1; }
        
        var test = function(row, col) { return board[col][row] == board[col][row-1]; };
        var accumulator = function(row, col) { return checkBoard[col][row-1].cols + 1; };
	
        return check(row, col, board, test, accumulator);
    },
    rows: function(row, col, board, checkBoard) {
        if(col == 0) { return 1; }
        
        var test = function(row, col) { return board[col][row] == board[col-1][row]; };
        var accumulator = function(row, col) { return checkBoard[col-1][row].rows + 1; };
	
        return check(row, col, board, test, accumulator);
    },
    diag_lr: function(row, col, board, checkBoard) {
        if(col == 0 || row == 0) { return 1; }
        
        var test = function(row, col) { return board[col][row] == board[col-1][row-1]; };
        var accumulator = function(row, col) { return checkBoard[col-1][row-1].diag_lr + 1; };
        return check(row, col, board, test, accumulator);
    },
    diag_rl: function(row, col, board, checkBoard) {
        var rows = board[0].length;
        if(col == 0 || row == rows-1) { return 1; }
        
        var test = function(row, col) { return board[col][row] == board[col-1][row+1]; };
        var accumulator = function(row, col) { return checkBoard[col-1][row+1].diag_rl + 1; };
        return check(row, col, board, test, accumulator);
    }
};

exports.nextPlayer = function(player) {
    if(player == Players.P1) { return Players.P2; }
    if(player == Players.P2) { return Players.P1; }
};

/* returns the lowest row index with a piece for given col */
var highestFilledRow = function(board, col) {
    var targetCol = board[col];
    var rows = targetCol.length;
    var highestFilledRow = rows;
    for(var i=0; i<rows; i++) {
        if(targetCol[i] != Players.EMPTY) {
            highestFilledRow = i;
            break;
        }
    }
    return highestFilledRow;
};
exports.highestFilledRow = highestFilledRow;

var isLegalMove = function(board, col) {
    if(board === undefined || 
       board.length == 0 || 
       board[col] === undefined ||
       board[col].length == 0) 
    { return false; }
    return highestFilledRow(board, col) > 0;
};
exports.isLegalMove = isLegalMove;

var findLegalMoves = function(board) {
    var legalMoves = [];
    for(var col=0; col<board.length; col++) {
        if(isLegalMove(board, col)) {
            legalMoves.push(col);
        }
    }
    return legalMoves;
};
exports.findLegalMoves = findLegalMoves;
        
/* initializes the board to initialValueFn(row,col) */    
var initBoard = function(rows, cols, initialValueFn) {
    var board = [];
    for(var i=0; i<cols; i++) {
        board[i] = [];
        for(var j=0; j<rows; j++) {
            board[i][j] = initialValueFn(j,i);
        }
    }
    return board;
};
exports.initBoard = initBoard;

/* returns the player who won, or false */
exports.checkWin = function(board) {
    if(board === undefined || board[0] === undefined) return 'tie';
    
    var cols = board.length;
    var rows = board[0].length;
    var initFn = function() { return {cols:0, rows:0, diag_lr:0, diag_rl: 0}; };
    var checkBoard = initBoard(rows, cols, initFn);
    for(var col=0; col<cols; col++) {
        for(var row=0; row<rows; row++) {
            for(var dir in checkBoard[col][row]) {
                checkBoard[col][row][dir] = checker[dir](row, col, board, checkBoard);
                if(checkBoard[col][row][dir] == 4) { return board[col][row]; }
            }
        }
    }
            
    if(findLegalMoves(board).length == 0) {
        return 'tie';
    }
    
    return false;
};
