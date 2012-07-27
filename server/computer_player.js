var http = require('http');
var url = require('url');

ComputerPlayer = function(moveUrl, playerIdx, moveCallback) {
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

        this.makeRequest.call(this, state, callback);
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

exports.ComputerPlayer = ComputerPlayer;
