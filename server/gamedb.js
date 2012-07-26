var GameDb = function(db) {
    this.db = db;
};

GameDb.prototype.init = function(nick, board, callback) {
    var toInsert = {'nickname': nick, 'board':board};
    var that = this;
    this.db.createCollection('games', function(err, col) {
	that.db.collection('games', function(err, col) {
	    col.insert(toInsert, {safe:true}, function() { callback(toInsert._id); });
	});
    });
};
	
GameDb.prototype.findGame = function(id, callback) {
    this.db.collection('games', function(err, col) {
	col.find({'_id': col.db.bson_serializer.ObjectID.createFromHexString(id)}).toArray(function(err, results) {
	    var game = null;
	    if (0 != results.length) {
		game = results[0];
	    }
	    callback(game);
	});
    });
};

exports.GameDb = GameDb;
