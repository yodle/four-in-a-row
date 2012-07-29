$(document).ready(function() {


    var baseGameServerUrl = "http://localhost:3000/game";
    var gameInitUrl = baseGameServerUrl + "/init";
    var moveUrl = baseGameServerUrl + "/move";

    // This will be the user defined object which 
    // must have a 'getNextMove' function.
    var aiObject;

    /* Mobile Glboal Nav */
    $("#mGlobalNav select").on("change", function() {
        if ($(this).val() != "") {
            window.location.href = $(this).val();
        }
    });


	var Players = {
		EMPTY: 0,
		P1: 1,
		P2: 2
	}    

	var ROWS = 6;
	var COLS = 7;


	/* returns the lowest row index with a piece for given col */
	function highestFilledRow(board, col) {
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

    /**
     * Callback from the server when it finish processing out move/init.
     */
    function gameResponseCallback(data) {
        var winner = data.gameOver;
        var msg = data.msg;
        var board = data.board;
        var moveList = data.moveList;
        var lastMove = data.lastMove;
        var gameId = data._id;
		var player = data.turn;
		var moves = data.moves;

		var didWeWin = (winner == player);

		var lastMoveAnimationFinished = function() {
			if (!winner) {
				var moveColumn = aiObject.getNextMove(board, moveList);

				moveArgsData = {
					move: moveColumn
				};

				targetRow = highestFilledRow(board, moveColumn) - 1;
				thisMove = { 
					row: targetRow, 
					col: moveColumn, 
					player: player, 
					moves: moves + 1
				};

				var thisMoveAnimationFinished = function() {
					// Post move to server and expect json resonse in callback
					var url = moveUrl + '/' + gameId;
					$.ajax({
						type: "GET",
						url: url,
						data: moveArgsData,
						jsonp: "jsonp",
						success: gameResponseCallback,
						type: "jsonp",
						dataType: "jsonp"
					});
				}

				// Update game UI with last our move
				GAME_UI.dropPiece(thisMove, thisMoveAnimationFinished);
			}
			else {
				// Game is over.
				if (didWeWin) {
					endGame('You won!');
				}
				else {
					endGame('You lost!');
				}
			}
		};

		if (lastMove && !didWeWin) {
			// Update game UI with last move
			GAME_UI.dropPiece(lastMove, lastMoveAnimationFinished);
		}
		else {
			lastMoveAnimationFinished();
		}
    };


    /**
     * User sumbits form to start game
     */
    $("#inputCode").on("submit", function(){
        /* Value of textarea - Remove variable if you won't use it more than once */
        var codeInput = $("#codeInput").val();

        /* Difficulty chosen */
        var difficulty = $("input[name=difficulty]:checked").val();

        // Eval the user input function and get their object
        var userCodeInput = $("#codeInput").val();
        aiObject = eval(userCodeInput);

        var gameInitData = {
            nickname: 'kurt'
        };

		// Init game board
		GAME_UI.initBoard(ROWS, COLS);
		GAME_UI.resetBoard();
		GAME_UI.startGame();

        // Post to the server to start the game, and expect json response to callback
        var url = gameInitUrl + '/' + difficulty;
        $.ajax({
            type: "GET",
            url: url,
            data: gameInitData,
            jsonp: "jsonp",
            success: gameResponseCallback,
            type: "jsonp",
            dataType: "jsonp"
        });

        // All logic is done already, don't submit to this page...
        return false;
    });

    /**
     * Displays message lightbox with results of game
     */
    function endGame(message) {
        /* Open Lightbox */
        yodle.ui.lightbox.open('#gameStatusModal');

        /* Add text to modal body */
        $("#gameStatusModal .statusMessage p.message").html(message);
    }

	// Initialize the game ui 
	GAME_UI.init();
	GAME_UI.initBoard(ROWS, COLS);
	GAME_UI.resetBoard();
	GAME_UI.startGame();
});
