var MessagesDb = function(db) {
    this.db = db;
};

MessagesDb.prototype.find = function(level, win, callback) { 
    this.db.collection('ai-messages', function(err, col) {
	if (win) {
	    col.find({'ai' : parseInt(level)}, { 'win' : 1}).toArray(function(err, results) {returnResults(results, callback);});
	} else {
	    col.find({'ai' : parseInt(level)}, { 'loss' : 1}).toArray(function(err, results) {returnResults(results, callback);});
	}
    });
};

var returnResults = function(results, callback) {
    if (results.length == 0) {
	callback({ 'message' : 'Well this is embarassing. Something went wrong with our server.'});
    } else {
	callback({ 'message' : results[0].loss});
    }
};

exports.MessagesDb = MessagesDb;

