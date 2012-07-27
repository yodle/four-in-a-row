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

    /**
     * Callback from the server when it finish processing out move/init.
     */
    function gameResponseCallback(data) {
        var isGameOver = data.gameOver;
        var msg = data.msg;
        var board = data.board;
        var moveList = data.moveList;
        var gameId = data._id;

        if (state = "Open") {
            var moveColumn = aiObject.getNextMove(board, moveList);

            moveArgsData = {
                column: moveColumn
            };

            // Post move to server and expect json resonse in callback
            $.post(moveUrl + gameId, moveArgsData, gameResponseCallback, "json");
        }
        else {
            // Game is over.
            endGame(state, msg);
        }
    };

    /**
     * User sumits form to start game
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

        // Post to the server to start the game, and expect json response to callback
        var url =gameInitUrl + '/' + difficulty; // + '?jsonp=?'; 
        //$.get(url, gameInitData, gameResponseCallback, "json");

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
    function endGame(state, message) {
        /* Open Lightbox */
        yodle.ui.lightbox.open('#gameStatusModal');

        /* Add text to modal body */
        $("#gameStatusModal .statusMessage p.message").html(msg);
    }

});
