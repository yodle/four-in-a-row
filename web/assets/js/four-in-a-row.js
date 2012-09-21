$(document).ready(function() {
    var baseGameServerUrl = "http://localhost:3000/game";
    var gameInitUrl = baseGameServerUrl + "/init";
    var moveUrl = baseGameServerUrl + "/move";
    var ROWS = 6;
    var COLS = 7;
    var isPlayingManually;
    var isGameInProgress = false;
    var aiObject;

    /* Mobile Glboal Nav */
    $("#mGlobalNav select").on("change", function() {
        if ($(this).val() != "") {
            window.location.href = $(this).val();
        }
    });

    var makeJsonpAjaxRequest = function(url, data, callback) {
        $.ajax({
            type: "GET",
            url: url,
            data: data,
            jsonp: "jsonp",
            success: callback,
            type: "jsonp",
            dataType: "jsonp"
        });
    };

    var animateHumanMoveAndSendToServer = function(data, column) {
        moveArgsData = {
            move: column
        };

        targetRow = exports.highestFilledRow(data.board, column) - 1;
        data.lastMove = { 
            row: targetRow, 
            col: column, 
            player: data.humanPlayer, 
            moves: data.moves + 1
        };

        var thisMoveAnimationFinished = function() {
            // Post move to server and expect json resonse in callback
            var url = moveUrl + '/' + data.id;
            makeJsonpAjaxRequest(url, moveArgsData, gameResponseCallback);
        }

        // Update game UI with last our move
        GAME_UI.dropPiece(data, thisMoveAnimationFinished);
    };

    var makeNextMove = function(data, manuallyChosenMove) {
        if (data.error || data.gameOver) { 
            var didWeWin = (data.error == undefined) && (data.humanPlayer == data.gameOver);
            // Game is over.
            var msg = "";
            if (data.error != undefined) {
                msg = data.error;
            }
            else if (data.message) {
                msg = data.message;
            }
            else {
                // For some reason we didn't get message in the data, use default win/loss message.
                if (didWeWin) {
                    msg = "You won!";
                }
                else {
                    msg = "You lost!";
                }
            }

            GAME_UI.highlightWinSequence(data);
            endGame(msg, didWeWin);
        }
        else {
            var moveColumn = 0;
            if (isPlayingManually) {
                moveColumn = manuallyChosenMove;
            }
            else {
                try {
                    moveColumn = aiObject.getNextMove(data);
                }
                catch (error) {
                    var msg = error.name + " occurred evaluating getNextMove function, error message: " + error.message;
                    endGame(msg, false);
                    // don't send any move, let game be over
                    return;
                }
            }

            animateHumanMoveAndSendToServer(data, moveColumn);
        }
    };

    /**
     * Callback from the server when it finish processing out move/init.
     */
    var gameResponseCallback = function(data) {
        var isGameOver = (data.error || data.gameOver);

        if (!data.error && data.lastMove && data.gameOver != data.humanPlayer) {
            // Update game UI with last move
            GAME_UI.dropPiece(
                    data, 
                    makeNextMove, 
                    isPlayingManually
                    );
        }
        else {
            if (isPlayingManually && !isGameOver) {
                GAME_UI.waitForManualMove(data, makeNextMove);
            }
            else {
                makeNextMove(data);
            }
        }
    };


    /**
     * User sumbits form to start game
     */
    $("#inputCode").on("submit", function() {
        // Keep track of game in progress to prevent overlapping games being triggered
        if (isGameInProgress) {
            return false;
        }
        else {
            isGameInProgress = true;
        }

        /* Difficulty chosen */
        var difficulty = $("#difficultySelect option:selected").val();

        isPlayingManually = $("#playManuallyCheck").is(":checked");

        if (!isPlayingManually) {
            // Eval the user input function and get their object
            var userCodeInput = editor.getSession().getValue();

            try {
                aiObject = eval(userCodeInput);
            }
            catch (error) {
                var msg = error.name + " occurred evaluating input code, error message: " + error.message;
                endGame(msg, false);
                // don't init game or submit form
                return false;
            }
        }

        var nicknameValue = $("#nicknameInput").val();
        var gameInitData = {
            nickname: nicknameValue,
            isPlayingManually: isPlayingManually
        };

        // Init game board
        GAME_UI.initBoard(ROWS, COLS);
        GAME_UI.resetBoard();
        GAME_UI.startGame();

        // Post to the server to start the game, and expect json response to callback
        var url = gameInitUrl + '/' + difficulty;
        makeJsonpAjaxRequest(url, gameInitData, gameResponseCallback);

        // All logic is done already, don't submit to this page...
        return false;
    });

    /**
     * Displays message lightbox with results of game
     */
    var endGame = function(message, didWeWin) {
        isGameInProgress = false;

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
    };

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
    editor.setTheme("ace/theme/solarized_light");
    editor.getSession().setValue(
            "// Code must evalutate to an object containing the 'getNextMove' function.\n" +
            "(function() {\n" +
            "\treturn {\n" +
            "\t\t/**\n" +
            "\t\t * Gets the next move from the client-side AI.\n" +
            "\t\t * \n" +
            "\t\t * @data The standard JSON response as defined in the documentation.\n" +
            "\t\t */\n" +
            "\t\tgetNextMove: function(data) { \n" +
            "\t\t\t// Either a 1 or a 2, indicating which number\n" +
            "\t\t\t// represents the client-side player on the board.\n" +
            "\t\t\tvar playerNumber = data.playerNumber;\n" +
            "\t\t\t\n" +
            "\t\t\t// The current board state; a two-dimensional array with columns\n" +
            "\t\t\t// (left-to-right) on the first dimension.\n" +
            "\t\t\tvar board = data.board;\n" +
            "\t\t\t\n" +
            "\t\t\t// Instead of evaluating the board just\n" +
            "\t\t\t// always go in the first column.\n" +
            "\t\t\treturn 0;\n" +
            "\t\t}\n" +
            "\t};\n" +
            "})();\n"
            );
});
