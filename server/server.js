/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var mongo = require('mongodb');
var db = new mongo.Db('four-in-a-row', new mongo.Server('four-in-a-row.corp.yodle.com', 27017, {auto_reconnect: true}), {});

var gamedb = require('./gamedb');
var messagesdb = require('./aidb');
var game = require('./game');
var computerplayer = require('./computer_player');
var Utils = require('./utils');

// Configuration
var ROWS = 6;
var COLS = 7;
var PORT = 3000;

var ais = {
    1: {url:'http://four-in-a-row.corp.yodle.com:3001/ai/random'},
    2: {url:'http://four-in-a-row.corp.yodle.com:3001/ai/twostep'},
    3: {url:'http://four-in-a-row.corp.yodle.com:8080/opening'},
    4: {url:'http://four-in-a-row.corp.yodle.com:3003/minimax'},
    5: {url:'http://four-in-a-row.corp.yodle.com:3002/game'},
    6: {url:'http://four-in-a-row.corp.yodle.com:3001/ai/twostep'}
}
// Initialization
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    PORT = 3000;
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
    PORT = 80;
});

app.use(express.bodyParser());

db.open(function(err, client) { if (err) {throw err;} });
gameDb = new gamedb.GameDb(db);
messagesDb = new messagesdb.MessagesDb(db);

makeJsonp = function(jsonp, body) {
    if(jsonp) {
        return jsonp + "(" + body + ")";
    }
    else {
        return body;
    }
};

var errorResponse = function(error, gameSpec) {
    return JSON.stringify({'error': error});
};

var choosePlayer = function() {
    if(Math.random() < 0.5) {
        return Utils.Players.P1;
    }
    else {
        return Utils.Players.P2;
    }
};

// Routes
app.all('/game/init/:ailevel', function(req, res) {
    var aiLevel = parseInt(req.params.ailevel);
    var nickname = req.body.nickname || req.query.nickname || 'anonymous';
    var scaffold = req.body.scaffold || 'none';
    var isPlayingManually = (req.query.isPlayingManually === "true") || false;
    var jsonp = req.query.jsonp;

    if (isNaN(aiLevel) || aiLevel < 1 || aiLevel > 6) {
        res.end(makeJsonp(jsonp, errorResponse('ai level must be between 1 and 6, inclusive, with 1 being the easiest and 6 being the hardest')));
    }
    else
    {
        var player = choosePlayer();
        var theGame = game.newGame(ROWS, COLS, player, nickname, aiLevel, isPlayingManually);

        if(player == Utils.Players.P2) { // AI moves first
            var callback = function(result) {
                if(result.success) {
                    var moveResult = theGame.move(result.move);

                    gameDb.init(
                        theGame, 
                        function(gameId){
                            res.end(makeJsonp(jsonp, JSON.stringify(theGame)));
                        }
                    );
                }
            }

            var aiSpec = ais[aiLevel];
            var ai = new computerplayer.ComputerPlayer(aiSpec.url, theGame.turn, callback);
            ai.move('', theGame);
        }
        else { // Player moves first
            gameDb.init(
                theGame, 
                function(game){
                    res.end(makeJsonp(jsonp, JSON.stringify(theGame)));
                }
            );
        }
    }
});

var findGame = function(gameId, callback) {
    gameDb.findGame(
        gameId,
        function(game) {
            callback(game);
        }
    );
};

app.all('/game/move/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    var move = req.body.move || req.query.move;
    var jsonp = req.query.jsonp;
    if(typeof(move) === 'undefined') {
        res.end(makeJsonp(jsonp, errorResponse('Must specify a "move" parameter')));
        return;
    }
    findGame(gameId, function(gameSpec) {
        if(gameSpec === null) {
            res.end(makeJsonp(jsonp, errorResponse('Invalid GameId: ' + gameId)));
            return;
        }
        gameSpec = game.deserialize(gameSpec);

        var moveResult = gameSpec.move(move); // make the player's move
        if(moveResult.failed) {
            res.end(makeJsonp(jsonp, errorResponse(moveResult.message)));
            return;
        }

        var aiSpec = ais[gameSpec.aiLevel];
        var callback = function(result) {
            if(result.success) {
                var moveResult = gameSpec.move(result.move); // make the AI move
                if(moveResult.failed) {
                    res.end(makeJsonp(jsonp, errorResponse("something fishy is going on with your opponent, we're calling the game a draw")));
                    return;
                }
                gameDb.update(gameId, gameSpec, function(game) {
                    // AI wins!
                    if (gameSpec.gameOver) { 
                        ai.endGame(gameSpec);
                        messagesDb.find(gameSpec.aiLevel, gameSpec.moves, false, gameSpec.isPlayingManually, function(result) {
                            gameSpec.message = result.message;
                            res.end(makeJsonp(jsonp, JSON.stringify(gameSpec)));
                        });
                        return;
                    } else {
                        res.end(makeJsonp(jsonp, JSON.stringify(game)));
                    }
                });
            }
            else {
                res.end(makeJsonp(jsonp, errorResponse("opponent is taking a break, try again later\n" + result.error)));
                return; 
            }
        };
        var ai = new computerplayer.ComputerPlayer(aiSpec.url, gameSpec.turn, callback);

        if(gameSpec.gameOver) {
            //Player wins!
            gameDb.update(gameId, gameSpec, function(game) {
                ai.endGame(gameSpec);
                messagesDb.find(gameSpec.aiLevel, gameSpec.moves, true, gameSpec.isPlayingManually, function(result) {
                    gameSpec.message = result.message;
                    res.end(makeJsonp(jsonp, JSON.stringify(gameSpec)));
                });
                return;
            });
        }
        else {
            ai.move('', gameSpec);
        }
    });
});

app.get('/game/state/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    findGame(gameId, function(game) {
        var response = "{'error':'bad game id specified [" + gameId + "]'}";
        if(null !== game) {
            response = JSON.stringify(game);
        }
        res.end(response);
    });
});

// Application
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
