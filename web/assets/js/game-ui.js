$(window).resize(function() {
    if (GAME_UI.hasSizeChanged($(window).width())) {
        GAME_UI.resizeBoard();
    }
});

var GAME_UI = (function() {
    //game constants
    var EMPTY = 0;
    var humanPieceNum = 2;

    var $board = $('#board');

    var spriteWidth;
    var spriteHeight;
    var boardHeight;
    var squareSize;

    var REFRESH_RATE = 30;
    var pieceAcceleration = 0.02; // px/ms^2

    var baseImageUrl = "assets/images/game";
    var emptyPngPath = baseImageUrl + "/empty.png";
    var playerAiPngPath = baseImageUrl + "/playerAi.png";
    var playerHumanPngPath = baseImageUrl + "/playerHuman.png";
    var winPiecePngPath = baseImageUrl + "/winning.png";

    var uiFinishedCallback = null;
    var lastData = null;
    var isWaitingForAnimation = false;

    //ui state    
    var ui = {};

    var makeManualMove = function(col) {
        if (!isWaitingForAnimation && uiFinishedCallback) {
            uiFinishedCallback(lastData, col);
            // Clear out the callback so we don't re-use it on accident.
            uiFinishedCallback = null;
            currentMoveData = null;
        }
    }


    /*
     * return the sprite for piece for <player>
     */
    var pieceForPlayer = function(player) {
        if (player == humanPieceNum) {
            return ui.humanPiece;
        }
        else {
            return ui.aiPiece;
        }
    };

    var dropSprite = function(currentSprite, move, data, callback, isPlayingManually, dropFinishedCallback) {
        currentSprite.css({ 'background-size' : '100%' } );

        var animStart = new Date().getTime();
        var frameStart = new Date().getTime();
        var posAndVelocity = {pos: -spriteHeight, velocity: 0};
        var bottomOfCol = move.row * spriteHeight;

        var average = function(a){
            var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
            for(var m, s = 0, l = t; l--; s += a[l]);
            for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
            return r.deviation = Math.sqrt(r.variance = s / t), r;
        }
        var posdiffs = [];
        var dts = [];
        $.playground().registerCallback(function() { 
            bottomOfCol = move.row * spriteHeight;
            var frameEnd = new Date().getTime();
            posAndVelocity = function(posAndVelocity, startTime, endTime) {
                var dt = endTime - startTime;
                dts.push(dt);
                var previous = posAndVelocity.pos;
                posAndVelocity.pos = posAndVelocity.pos + posAndVelocity.velocity + pieceAcceleration / 2 * (dt * dt);
                posdiffs.push(posAndVelocity.pos - previous);
                posAndVelocity.velocity = posAndVelocity.velocity + pieceAcceleration * dt;
                return posAndVelocity;
            }(posAndVelocity, frameStart, frameEnd);

            frameStart = frameEnd;
            var newTop = posAndVelocity.pos;
            if(newTop < bottomOfCol) {
                currentSprite.css("top", newTop);
                return false;
            }
            else {
                currentSprite.css("top", bottomOfCol);

                if (dropFinishedCallback) {
                    dropFinishedCallback();
                }

                if (isPlayingManually && data.gameOver == 0) {
                    lastData = data;
                    uiFinishedCallback = callback;
                }
                else if (callback) {
                    callback(data);
                }
                return true;
            }

        }, REFRESH_RATE);
    };

    gameUiObj = {};
    gameUiObj.playerAiPngPath = playerAiPngPath;
    gameUiObj.playerHumanPngPath = playerHumanPngPath;

    gameUiObj.waitForManualMove = function(data, callback) {
        lastData = data;
        uiFinishedCallback = callback;
    };

    gameUiObj.initBoard = function(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    };

    gameUiObj.hasSizeChanged = function(currentWindowWidth) {
        if (currentWindowWidth < 479) {
            return (squareSize != 42);
        }
        if (currentWindowWidth <= 768) {
            return (squareSize != 64)
        }
        if (currentWindowWidth <= 970 && currentWindowWidth > 768) {
            return (squareSize != 64);
        }
        return (squareSize != 85);
    };

    gameUiObj.calculateBoardSize = function() {
        windowWidth = $(window).width();

        if (windowWidth < 479) {
            squareSize = 42;
        }
        else if (windowWidth <= 768) {
            squareSize = 64;
        }
        else if (windowWidth <= 970 && windowWidth > 768) {
            squareSize = 64;
        }
        else {
            squareSize = 85;
        }

        spriteWidth = squareSize;
        spriteHeight = squareSize;
    };

    gameUiObj.resizeBoard = function() {
        gameUiObj.calculateBoardSize();


        $("#boardsquares").children().each(function() {
            $(this).width(spriteWidth);
            $(this).height(spriteHeight);

            var pieceId = $(this).attr("id");
            parts = pieceId.split("x");
            row = parseInt(parts[0]) * spriteHeight;
            column = parseInt(parts[1]) * spriteWidth;

            $(this).css({ top : row, left : column });
        });

        $("#pieceSprites").children().each(function() {
            $(this).width(spriteWidth);
            $(this).height(spriteHeight);

            var pieceId = $(this).attr("id");
            // ID should be in form 'move{moveNumber}-{row}x{column}
            // i.e. move2-4x3
            parts = pieceId.split("-")[1].split("x");
            row = parseInt(parts[0]) * spriteHeight;
            column = parseInt(parts[1]) * spriteWidth;

            $(this).css({ top : row, left : column });
        });

        $("#game-board").height(6 * spriteHeight);
    };


    gameUiObj.resetBoard = function() {
        ui.boardLayer.empty();
        ui.pieceLayer.empty();

        gameUiObj.calculateBoardSize();
        gameUiObj.resizeBoard();

        for(var i = 0; i < this.rows; i++) {
            for(var j = 0; j < this.cols; j++) {
                var currentSquare = i + "x" + j;
                ui.boardLayer.addSprite(currentSquare, {
                    animation: ui.boardSquare, 
                    width: spriteWidth, 
                    height: spriteHeight, 
                    posx: j * spriteWidth, 
                    posy: i * spriteHeight
                });
                $('#'+currentSquare).css({ 'background-size' : '100%' } );

                // Create a closure for the callback so it can hold
                // onto the column variable
                var clickCallback = (function(col) {
                    return function() {
                        makeManualMove(col);
                    }
                })(j);

                $('#'+currentSquare).click(clickCallback);
            }
        }
    };

    gameUiObj.startGame = function() {
        $.playground().startGame();
    };

    gameUiObj.highlightWinSequence = function(data) {
        var winMoves = exports.getWinSequence(data.board);
        if (!winMoves) {
            return;
        }

        for (var i = 0; i < winMoves.length; i++) {
            gameUiObj.highlightWinMove(winMoves[i]);
        }
    };

    gameUiObj.highlightWinMove = function(move, data) {
        var piece = ui.winPiece;
        var moveId = "win-" + move.row + "x" + move.col;
        var sprite = ui.pieceLayer.addSprite(moveId, {
            animation: piece,
            width: spriteWidth,
            height: spriteHeight,
            posx: move.col * spriteWidth,
            posy: -spriteHeight 
        });

        var currentSprite = $("#"+moveId);
        dropSprite(currentSprite, move, data);
    };


    gameUiObj.dropPiece = function(data, callback, isPlayingManually, dropFinishedCallback) {
        humanPieceNum = data.challengerPlayer;
        var move = data.lastMove;
        var piece = pieceForPlayer(move.player);
        var curPieceId = move.moves;
        var moveId = "move" + curPieceId + "-" + move.row + "x" + move.col;
        var sprite = ui.pieceLayer.addSprite(moveId, {
            animation: piece,
            width: spriteWidth,
            height: spriteHeight,
            posx: move.col * spriteWidth,
            posy: -spriteHeight 
        });
        var currentSprite = $("#"+moveId);
        dropSprite(currentSprite, move, data, callback, isPlayingManually, dropFinishedCallback);
    };


    gameUiObj.init =  function() {
        ui.boardSquare = new $.gameQuery.Animation({ imageURL: emptyPngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        ui.aiPiece = new $.gameQuery.Animation({ imageURL: playerAiPngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        ui.humanPiece = new $.gameQuery.Animation({ imageURL: playerHumanPngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        ui.winPiece = new $.gameQuery.Animation({ imageURL: winPiecePngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        $board.playground({height: 'auto', width: 'auto'})
            .addGroup("pieceSprites", {height: 'auto', width: 'auto'}).end()
            .addGroup("boardsquares", {height: 'auto', width: 'auto'});

        $board.css({'position' : 'static'});

        ui.boardLayer = $("#boardsquares");    
        ui.pieceLayer = $("#pieceSprites");
    };

    return gameUiObj;
})();
