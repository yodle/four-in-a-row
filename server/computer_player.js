"use strict";

var http = require('http');
var url = require('url');

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
    if(state.turn == this.playerIdx) {
        var mc = this.moveCallback;
        var callback = function(moveJson) {
            mc(moveJson);
        };

        this.makeRequest.call(this, state, 'move', callback);
    }
};

ComputerPlayer.prototype.makeRequest = function(state, action, callback) {
    var data = JSON.stringify(state);
    var path = this.moveUrl.pathname + '/' + action;
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
        res.on('data', function(rawData) {
            try {
                var data = JSON.parse(rawData);
                data.success = true;
                if(typeof(callback) === 'function') {
                    callback(data);
                }
            }
            catch (e) {
                if(typeof(callback) === 'function') {
                    callback({success: false, error: 'misbehaving AI, try again later'});
                }
            }
        });
    });
    req.on('error', function(e) {
        if(typeof(callback) === 'function') {
            callback({success: false, error: e});
        }
    });
    
    req.end(data);
};

ComputerPlayer.prototype.endGame = function(state) {
    this.makeRequest.call(this, state, 'end');
};

ComputerPlayer.prototype.toString = function() {
    return "Computer Player " + this.playerIdx;
};

exports.ComputerPlayer = ComputerPlayer;
