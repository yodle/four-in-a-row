exports.GameDb = (function (db) {
    return {
	init: function(nick) {
	    var gameId = "" + new Date().getTime() + Math.floor(Math.random() * 100000);
	    db.open(function(err,client) { 
		client.createCollection('games', function(err, col) {
		    client.collection('games', function(err, col) {
			col.insert({'nickname': nick, 'gameId': gameId}, function() {});
		    });
		});
	    });
	    return gameId;
	},
	
	findGame: function(id, callback) {
		db.open(function(err, client) {
			client.collection('games', function(err, col) {
				client.find({'gameId': id}, function(err, cursor) {
					callback(cursor[0]);
				});
			});
		});
	},
    };
});
