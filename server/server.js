"use strict";

/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var mongo = require('mongodb');
var db = new mongo.Db('four-in-a-row', new mongo.Server('x4.corp.yodle.com', 27017, {auto_reconnect: true}), {});

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
    1: {url:'http://x4.corp.yodle.com:3001/ai/random'},
    2: {url:'http://x4.corp.yodle.com:3001/ai/twostep'},
    3: {url:'http://x4.corp.yodle.com:3004/front/front/move'},
    4: {url:'http://x4.corp.yodle.com:3003/minimax'},

    // Going to make 5 and 6 the same for now
    //5: {url:'http://x4.corp.yodle.com:3002/game'},
    5: {url:'http://x4.corp.yodle.com:3005/front/front'},
    6: {url:'http://x4.corp.yodle.com:3005/front/front'}
};

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
var gameDb = new gamedb.GameDb(db);
var messagesDb = new messagesdb.MessagesDb(db);

var makeJsonp = function(jsonp, body) {
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
    var aiLevel = parseInt(req.params.ailevel, 10);
    var nickname = req.body.nickname || req.query.nickname || 'anonymous';
    var scaffold = req.body.scaffold || 'none';
    var isPlayingManually = (req.query.isPlayingManually === "true") || false;
    var jsonp = req.query.jsonp;

    if (isNaN(aiLevel) || aiLevel < 1 || aiLevel > 6) {
        res.end(makeJsonp(jsonp, errorResponse('ai level must be between 1 and 6, inclusive, with 1 being the easiest and 6 being the hardest')));
    }
    else
    {
        console.log('before choose player');
        var player = choosePlayer();
        console.log('before new game');
        var theGame = game.newGame(ROWS, COLS, player, nickname, aiLevel, isPlayingManually);

        var callbackAfterInit;
        if(player == Utils.Players.P2) { // AI moves first
            callbackAfterInit = function(gameId) {
                console.log('game id type:' + typeof(gameId));
                handleBoardStateAndAiMove(theGame, jsonp, res, gameId);
            }
        }
        else { // Player moves first
            callbackAfterInit = function() {
                res.end(makeJsonp(jsonp, JSON.stringify(theGame)));
            };
        }
        console.log('before init');
        gameDb.init(theGame, callbackAfterInit);
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

var handleBoardStateAndAiMove = function(gameSpec, jsonp, res, gameId) {
        var aiSpec = ais[gameSpec.aiLevel];
        var callback = function(result) {
            if(result.success) {
                var moveResult = gameSpec.move(result.move); // make the AI move
                if(moveResult.failed) {
                    res.end(makeJsonp(jsonp, errorResponse("something fishy is going on with your opponent, we're calling the game a draw")));
                    return;
                }
                gameDb.update(gameId, gameSpec, function(game) {
                    if (gameSpec.gameOver && gameSpec.gameOver != 3) { 
                        // AI wins!
                        ai.endGame(gameSpec);
                        messagesDb.find(gameSpec.aiLevel, gameSpec.moves, false, gameSpec.isPlayingManually, function(result) {
                            gameSpec.message = result.message;
                            res.end(makeJsonp(jsonp, JSON.stringify(gameSpec)));
                        });
                        return;
                    } 
                    else if (gameSpec.gameOver == 3) {
                        // Tie
                        ai.endGame(gameSpec);
                        gameSpec.message = ""; // let the UI header do the talking
                        res.end(makeJsonp(jsonp, JSON.stringify(gameSpec)));
                        return;
                    }
                    else {
                        console.log('before res.end');
                        res.end(makeJsonp(jsonp, JSON.stringify(game)));
                    }
                });
            }
            else {
                res.end(makeJsonp(jsonp, errorResponse("opponent is taking a break, try again later\n" + result.error)));
                return; 
            }
        };

        console.log('before creating computer player');
        var ai = new computerplayer.ComputerPlayer(aiSpec.url, gameSpec.turn, callback);

        if(gameSpec.gameOver && gameSpec.gameOver != 3) {
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
        else if (gameSpec.gameOver == 3) {
            // Tie
            ai.endGame(gameSpec);
            gameSpec.message = ""; // let the UI header do the talking
            res.end(makeJsonp(jsonp, JSON.stringify(gameSpec)));
            return;
        }
        else {
            console.log('before ai.move');
            ai.move('', gameSpec);
        }
};

app.all('/game/move/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    // Make sure the game ID is a string
    if (gameId) {
        gameId = gameId.toString();
    }
    var move = req.body.move || req.query.move;
    var jsonp = req.query.jsonp;
    if(typeof(move) === 'undefined') {
        res.end(makeJsonp(jsonp, errorResponse('Must specify a "move" parameter')));
        return;
    }
    console.log('before find game');
    findGame(gameId, function(gameSpec) {
        if(gameSpec === null) {
            res.end(makeJsonp(jsonp, errorResponse('Invalid GameId: ' + gameId)));
            return;
        }
        console.log('before find game');
        gameSpec = game.deserialize(gameSpec);

        console.log('before gameSpec.move');
        var moveResult = gameSpec.move(move); // make the player's move
        if(moveResult.failed) {
            res.end(makeJsonp(jsonp, errorResponse(moveResult.message)));
            return;
        }

        handleBoardStateAndAiMove(gameSpec, jsonp, res, gameId);
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
