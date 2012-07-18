exports.GameDb = (function (db) {
    return {
	init: function(nick, board, callback) {
	    var toInsert = {'nickname': nick, 'board':board};
	    db.open(function(err, client) { 
		client.createCollection('games', function(err, col) {
		    client.collection('games', function(err, col) {
			col.insert(toInsert, {safe:true}, function() { callback(toInsert._id); });
		    });
		});
	    });
	},
	
	findGame: function(id, callback) {
		db.open(function(err, client) {
			client.collection('games', function(err, col) {
			    col.find({'_id': col.db.bson_serializer.ObjectID.createFromHexString(id)}).toArray(function(err, results) {
				    var game = null;
				    if (0 != results.length) {
					game = results[0];
				    }
				    callback(game);
				});
			});
		});
	},
    };
});
