$(window).resize(function() {


    if (GAME_UI.hasSizeChanged($(window).width())) {
        GAME_UI.resizeBoard();
    }
});

var GAME_UI = (function() {
    //game constants
    var EMPTY = 0;
    var P1 = 1;
    var P2 = 2;

    var $board = $('#c4-board');
    //ui constants
    //var HEIGHT = $board.height();
    //var WIDTH = $board.width();

    var spriteWidth;// = WIDTH / 7;
    var spriteHeight; // = HEIGHT / 6;

    var REFRESH_RATE = 30;
    var pieceAcceleration = 0.02; // px/ms^2

    var squareSize = 64;


	var baseImageUrl = "assets/images/game";
	var emptyPngPath = baseImageUrl + "/empty.png";
	var player1PngPath = baseImageUrl + "/player1.png";
	var player2PngPath = baseImageUrl + "/player2.png";

    //ui state    
    var ui = {};

    /* 
     * return a function which will emit the correct 'move' message for <col> on <socket>
     */
    var clickFnFor = function(col, makeMove) {
        return function(e) {
            makeMove(col);
        }
    };

    /*
     * return the sprite for piece for <player>
     */
    var pieceForPlayer = function(player) {
        if(player == P1) {
            return ui.p1Piece;
        }
        if(player == P2) {
            return ui.p2Piece;
        }
    };




    gameUiObj = {};
	gameUiObj.player1PngPath = player1PngPath;
	gameUiObj.player2PngPath = player2PngPath;


    gameUiObj.initBoard = function(rows, cols) {
        this.rows = rows;
        this.cols = cols;
    };


    gameUiObj.hasSizeChanged = function(currentWindowWidth) {
        if (currentWindowWidth < 479) {
            return (squareSize != 42);
        }
        else if (currentWindowWidth < 970 && currentWindowWidth > 768) {
            return (squareSize != 53);
        }
        return (squareSize != 64);
    };

    gameUiObj.calculateBoardSize = function() {
        windowWidth = $(window).width();

        if (windowWidth < 479) {
            squareSize = 42;
        }
        else if (windowWidth < 970 && windowWidth > 768) {
            squareSize = 53;
        }
        else {
            squareSize = 64;
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
        

    };


    gameUiObj.resetBoard = function() {
        ui.boardLayer.empty();
        ui.pieceLayer.empty();
        
        gameUiObj.calculateBoardSize();

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

            }
        }
    };

    gameUiObj.startGame = function() {
        $.playground().startGame();
    };

    gameUiObj.dropPiece = function(move, animFinishedCallback) {
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
        var bottomOfCol = move.row * spriteHeight;
        
        var currentSprite = $("#"+moveId);
        currentSprite.css({ 'background-size' : '100%' } );

        var animStart = new Date().getTime();
        var frameStart = new Date().getTime();
        var posAndVelocity = {pos: -spriteHeight, velocity: 0};

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
                var animEnd = (new Date().getTime() - animStart);
                animFinishedCallback();

                console.log("animation finished in: " + animEnd + "ms, final velocity: " + posAndVelocity.velocity + ", avgMove: " + average(posdiffs).mean + ", avgDt: " + average(dts).mean + ", steps: " + dts.length);
                return true;
            }

        }, REFRESH_RATE);
    };

    gameUiObj.init =  function() {
        ui.boardSquare = new $.gameQuery.Animation({ imageURL: emptyPngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        ui.p1Piece = new $.gameQuery.Animation({ imageURL: player1PngPath,
            numberOfFrame: 1,
            type: $.gameQuery.ANIMATION_ONCE,
            offsetx: 0,
            offsety: 0});

        ui.p2Piece = new $.gameQuery.Animation({ imageURL: player2PngPath,
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
