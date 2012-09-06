var MessagesDb = function(db) {
    this.db = db;
};

var DEF_ERR_MSG = "Well this is embarassing. Something went wrong with our server.";

MessagesDb.prototype.find = function(level, moves, win, manual, callback) {
    var that = this;
    this.db.collection('ai-messages', function(err, col) {
	if (win) {
	    col.find( { 'win' : win, 'manual' : manual }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db) });
	} else {
	    if (parseInt(moves) > 10) {
            col.find( { 'win' : win, 'tenMoves' : true }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db) });
	    } else {
            col.find( { 'win' : win, 'tenMoves' : false }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db) });
	    }
	}
    });
};

var findLevelCode = function(results, callback, level, win, db) {
    if (results.length == 0) {
        callback({ 'message' : DEF_ERR_MSG });
    }
    else {
        var template = results[0].template;
        db.collection('ai-messages', function(err, col) {
            if (win) {
                col.find({ 'ai' : parseInt(level) }, { 'win' : 1 }).toArray(function(err, results) { generateMessage(results, callback, level, template); });
            } else {
                col.find({ 'ai' : parseInt(level) }, { 'loss' : 1 }).toArray(function(err, results) { generateMessage(results, callback, level, template); });
            }
        });
    }
};

var generateMessage = function(results, callback, level, template) {
    if (results.length == 0) {
        callback({ 'message' : DEF_ERR_MSG });
    }
    else {
        var message= template.replace('$', level);
        if (results[0].win != undefined) {
            message= message.replace(/XXXXXXX/g, results[0].win);
        } else {
            message= message.replace(/XXXXXXX/g, results[0].loss);
        }
        callback({ 'message' : message});
    }
};

exports.MessagesDb = MessagesDb;

