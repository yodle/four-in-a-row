/**
 * Module dependencies.
 */
var express = require('express');
var app = module.exports = express.createServer();
var http = require('http');
var url = require('url');
var mongo = require('mongodb');
var db = new mongo.Db('mydb', new mongo.Server('localhost', 27017, {}), {});

var gamedb = require('./gamedb');

var c4engine = require('./engine');
var Utils = c4engine.Utils;

var randomAi = require('./ais/random_ai');
var twoStepAi = require('./ais/twostep_ai');
var replayAi = require('./ais/replay_ai');

// Configuration

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

var port = 3000;

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
    port = 3000;
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
    port = 80;
});

app.use(express.bodyParser());

app.post('/game/init/:ailevel', function(req, res) {
    var ai = parseInt(req.params.ailevel);
    var nickname = req.body.nickname || 'anonymous';

    if (isNaN(ai) || ai < 1 || ai > 6) {
        res.end(JSON.stringify({error: 'ai level must be between 1 and 6, inclusive, with 1 being the easiest and 6 being the hardest'}));
    }
    else
    {
        var game = gamedb.GameDb(db).init(nickname);
        res.end(JSON.stringify(game));
    }
});

app.post('/game/move/:gameId', function(req, res) {
    var game = req.params.gameId;
    res.end(JSON.stringify({msg:'', state:'Open', board:[[0,0,0,0,0,1]]}));
});

app.post('/ai/random/move', function(req, res) {
    var move = randomAi.move(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({move: move}));
});

app.post('/ai/twostep/move', function(req, res) {
    var move = twoStepAi.move(req.body);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({move: move}));
});

app.post('/ai/replay/move', function(req, res) {
    var move = replayAi.move(req.body, req.query['m'].split(','));
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({move: move}));
});

var ComputerPlayer = function(moveUrl, playerIdx, moveCallback) {
    this.playerIdx = playerIdx;
    this.moveUrl = url.parse(moveUrl);
    this.moveCallback = moveCallback;
};

ComputerPlayer.prototype.valid = function() {
    if(this.moveUrl.hostname === undefined) {
        return false;
    }
    
    return true;
};

ComputerPlayer.prototype.move = function(msg, state) {  
    if(state.currentTurn == this.playerIdx) {
        var mc = this.moveCallback;
        var callback = function(moveJson) {
            var move = moveJson.move;
            mc(move);
        };

        var that = this;
        // this artifically slows down the game pace
        setTimeout(function() { that.makeRequest.call(that, state, callback) }, 500);
    }
};

ComputerPlayer.prototype.makeRequest = function(state, callback) {
    var data = JSON.stringify(state);
    var path = this.moveUrl.pathname;
    if(this.moveUrl.search) {
        path = path + this.moveUrl.search;
    }
    var options = {
        host: this.moveUrl.hostname,
        port: this.moveUrl.port,
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        },
        method: 'POST'
    };

    var req = http.request(options, function(res) {
        res.on('data', function(data) {
            callback(JSON.parse(data));
        });
    });
    
    req.end(data);
};

ComputerPlayer.prototype.toString = function() {
    return "Computer Player " + this.playerIdx;
};

// Application
var ROWS = 6;
var COLS = 7;

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
