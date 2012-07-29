var GAME_UI = (function() {
    //game constants
    var EMPTY = 0;
    var P1 = 1;
    var P2 = 2;
    
	var $board = $('#c4-board');
    //ui constants
    var HEIGHT = $board.height();
    var WIDTH = $board.width();
    
	var spriteWidth = WIDTH / 7;
	var spriteHeight = HEIGHT / 6;

    var REFRESH_RATE = 30;
    var pieceAcceleration = 0.02; // px/ms^2
    
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
    
    return {
        initBoard: function(rows, cols) {
            this.rows = rows;
            this.cols = cols;
			HEIGHT = $board.height();
			WIDTH = $board.width();
			spriteWidth = WIDTH / cols;
			spriteHeight = HEIGHT / rows;
        },
        
        //resetBoard: function(boardQueryCallback, colClickCallback) {
        resetBoard: function() {
            ui.boardLayer.empty();
            ui.pieceLayer.empty();
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
                    
                  //  if(boardQueryCallback(i, j) != EMPTY) {
                  //      ui.pieceLayer.addSprite(currentSquare + '-piece', {
                  //              animation: pieceForPlayer(boardQueryCallback(i, j)),
                  //              width: spriteWidth,
                  //              height: spriteHeight,
                  //              posx: j * spriteWidth,
                  //              posy: i * spriteHeight
                  //      });
                  //  }

                  //  $("#" + currentSquare).click(clickFnFor(j, colClickCallback));
                }
            }    
        },
        
        startGame: function() {
            $.playground().startGame();
        },
        
        dropPiece: function(move, animFinishedCallback) {
            var piece = pieceForPlayer(move.player);
            var curPieceId = move.moves;
            var sprite = ui.pieceLayer.addSprite("move" + curPieceId, {
                        animation: piece,
                        width: spriteWidth,
                        height: spriteHeight,
                        posx: move.col * spriteWidth,
                        posy: -spriteHeight 
            });
            var bottomOfCol = move.row * spriteHeight;
                
            var currentSprite = $("#move" + curPieceId);
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

			// TODO - make this wait
        },
        
        init: function() {
			var baseImageUrl = "assets/images/c4-board";
            ui.boardSquare = new $.gameQuery.Animation({ imageURL: baseImageUrl + "/empty-board.png",
                                                    numberOfFrame: 1,
                                                    type: $.gameQuery.ANIMATION_ONCE,
                                                    offsetx: 0,
                                                    offsety: 0});

            ui.p1Piece = new $.gameQuery.Animation({ imageURL: baseImageUrl + "/player1.png",
                                                    numberOfFrame: 1,
                                                    type: $.gameQuery.ANIMATION_ONCE,
                                                    offsetx: 0,
                                                    offsety: 0});
                                                    
            ui.p2Piece = new $.gameQuery.Animation({ imageURL: baseImageUrl + "/player2.png",
                                                    numberOfFrame: 1,
                                                    type: $.gameQuery.ANIMATION_ONCE,
                                                    offsetx: 0,
                                                    offsety: 0});
                                                    
            $board.playground({height: HEIGHT, width: WIDTH})
                .addGroup("pieceSprites", {height: HEIGHT, width: WIDTH}).end()
                .addGroup("boardsquares", {height: HEIGHT, width: WIDTH});
                
            ui.boardLayer = $("#boardsquares");    
            ui.pieceLayer = $("#pieceSprites");
        }
    };
})();
