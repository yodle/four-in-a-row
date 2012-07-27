/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var mongo = require('mongodb');
var db = new mongo.Db('mydb', new mongo.Server('localhost', 27017, {auto_reconnect: true}), {});

var gamedb = require('./gamedb');
var game = require('./game');
var computerplayer = require('./computer_player');
var Utils = require('./utils');

// Configuration
var ROWS = 6;
var COLS = 7;
var PORT = 3000;

var ais = {
    1: {url:'http://localhost:3001/ai/random/move'},
    2: {url:'http://localhost:3001/ai/twostep/move'}
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

makeJsonp = function(jsonp, body) {
    if(jsonp) {
        return jsonp + "(" + body + ")";
    }
    else {
        return body;
    }
};
// Routes
app.post('/game/init/:ailevel', function(req, res) {
    var ai = parseInt(req.params.ailevel);
    var nickname = req.body.nickname || 'anonymous';
    var jsonp = req.body.jsonp;

    if (isNaN(ai) || ai < 1 || ai > 6) {
        res.end(JSON.stringify({error: 'ai level must be between 1 and 6, inclusive, with 1 being the easiest and 6 being the hardest'}));
    }
    else
    {
	var theGame = game.newGame(ROWS, COLS, Utils.Players.P1, nickname, ai); // TODO: WML: hard-coded P1
	gameDb.init(
	    theGame, 
	    function(game){
            res.end(makeJsonp(jsonp, JSON.stringify(theGame)));
	    }
	);
    }
});

function findGame(gameId, callback) {
    gameDb.findGame(
        gameId,
        function(game) {
            callback(game);
        }
    );
};

app.post('/game/move/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    var move = req.body.move;
    var jsonp = req.body.jsonp;
    findGame(gameId, function(gameSpec) {
        gameSpec = game.deserialize(gameSpec);
        gameSpec.move(move); // make the player's move
        var aiSpec = ais[gameSpec.ai];
        var callback = function(move) {
            gameSpec.move(move); // make the AI move
            gameDb.update(gameId, gameSpec, function(game) {
                res.end(makeJsonp(jsonp, JSON.stringify(game)));
            });
        };
        var ai = new computerplayer.ComputerPlayer(aiSpec.url, game.turn, callback);
        ai.move('', gameSpec);
    });
});

app.get('/game/state/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    findGame(gameId, function(game) {
        var response = "{'error':'bad game id specified [" + gameId + "]'}";
        if(null != game) {
            response = JSON.stringify(game);
        }
        res.end(response);
    });
});

// Application
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
