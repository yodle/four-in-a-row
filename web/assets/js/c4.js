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
		// Make sure the page is displaying the correct player piece to
		// indicate the human player
		var piecePng = "";
		if (data.humanPlayer == 1) {
			$("#playerPiece")
				.removeClass("player2Piece")
				.addClass("player1Piece");
		}
		else {
			$("#playerPiece")
				.removeClass("player1Piece")
				.addClass("player2Piece");
		}


		var didWeWin = (data.humanPlayer == data.gameOver);

		var lastMoveAnimationFinished = function() {
			if (!data.gameOver) {
				var moveColumn = aiObject.getNextMove(data.humanPlayer, data.board, data.moveList);

				moveArgsData = {
					move: moveColumn
				};

				targetRow = highestFilledRow(data.board, moveColumn) - 1;
				thisMove = { 
					row: targetRow, 
					col: moveColumn, 
					player: data.humanPlayer, 
					moves: data.moves + 1
				};

				var thisMoveAnimationFinished = function() {
					// Post move to server and expect json resonse in callback
					var url = moveUrl + '/' + data._id;
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
					endGame('You won!', didWeWin);
				}
				else {
					endGame('You lost!', didWeWin);
				}
			}
		};

		if (data.lastMove && !didWeWin) {
			// Update game UI with last move
			GAME_UI.dropPiece(data.lastMove, lastMoveAnimationFinished);
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
		var difficulty = $("#difficultySelect option:selected").val();

		// Eval the user input function and get their object
		var userCodeInput = editor.getSession().getValue();
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
	function endGame(message, didWeWin) {
		/* Open Lightbox */
		yodle.ui.lightbox.open('#gameStatusModal');

		/* Add text to modal body */
		$("#gameStatusModal .statusMessage strong").first().html(message);

		if (didWeWin) {
			$("#gameStatusModal .statusMessage")
				.removeClass("error")
				.addClass("success");
		}
		else {
			$("#gameStatusModal .statusMessage")
				.removeClass("success")
				.addClass("error");
		}



	}

	// Initialize the game ui 
	GAME_UI.init();
	GAME_UI.initBoard(ROWS, COLS);
	GAME_UI.resetBoard();
	GAME_UI.startGame();

	// Ace
	var editor = ace.edit("editor");
	var JavaScriptMode = require("ace/mode/javascript").Mode;
	editor.getSession().setMode(new JavaScriptMode());
	editor.setShowPrintMargin(false);
	editor.setTheme("ace/theme/solarized_dark");
	editor.getSession().setValue(
			"// Code must evalutate to an object containing the 'getNextMove' function.\n" +
			"(function() {\n" +
			"    return {\n" +
			"         /**\n" +
			"          * Gets the next move from the client-side AI.\n" +
			"          * \n" +
			"          * @playerNumber Either a 1 or a 2, indicating which number\n" +
			"          *     represents the client-side player on the board.\n" +
			"          * @board The current board state; a two-dimensional array with columns\n" +
			"          *     (left-to-right) on the first dimension\n" + 
			"          *     and rows (top to bottom) on the second.\n" +
			"          * @moveList An array containing the move history\n" + 
			"          *     in ascending chronological order.\n" +
			"          */\n" +
			"         getNextMove: function(playerNumber, board, moveList) { \n" +
			"             // Instead of evaluating the board just\n" +
			"             // return a random move (0-6 are valid columns)\n" +
			"             return Math.floor(Math.random() * 6);\n" +
			"         }\n" +
			"       }\n" +
			"})();\n"
			);
});
