var gamedb = require('../gamedb');
var assert = require('assert');

var mockMongo = { 
	db: {
	},
	collection: {
	    insert: function(object, params, callback) {
			object._id = "" + new Date().getTime() + Math.floor(Math.random() * 100000);
			mockMongo.db[object._id] = object;
			callback();
	    },
	    db: {
		bson_serializer: {
		    ObjectID: {
			createFromHexString : function(id) { return id; }
		    }
		}
	    },
	    find: function(document, callback) {
		return {
		    toArray : function(callback) {
			callback(null, [mockMongo.db[document._id]]);
		    }
		}
	    }
	},
	client: {
		createCollection: function(collectionName, callback) {
			callback(null, mockMongo.collection);
		},
		collection: function(collectionName, callback) {
			callback(null, mockMongo.collection);
		},
	},
    open: function(callback) {
		callback(null, mockMongo.client);	
    }

};

var before = function() {
    return gamedb.GameDb(mockMongo);
};

var nonEmpty = function(possiblyEmpty) {
    return null != possiblyEmpty && undefined != possiblyEmpty;
};

module.exports = {
    'init returns game identifier': function() {
	before().init('dennis', function(gameId){
	    assert.equal(true, nonEmpty(gameId) && 0  < gameId.length);
	});
    },

    'consecutive inits result in distinct game Ids': function() {
	var underTest = before();
	underTest.init('dennis', function(game1) {
	    underTest.init('fend', function(game2) {
		assert.equal(false, game1 == game2);		
	    });
	});
    },

    'gamedb can recover game state from init': function() {
	var underTest = before();
        underTest.init('dennis', function(gameId) { 
	    underTest.findGame(gameId, function(nick) {
		assert.equal(true, nonEmpty(nick));
	    });
	});
    },

    'gamedb recovers nickname from init': function() {
	var underTest = before();
	underTest.init('nick', function(gameId) {
	    underTest.findGame(gameId, function(obj) {
		assert.equal('nick', obj.nickname);
	    });
	});
    }
};
