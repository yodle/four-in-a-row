var gamedb = require('../gamedb');
var assert = require('assert');

var mockMongo = {
    memoryStore: { },
    col: {
	insert: function(object, params, callback) {
	    object._id = "" + new Date().getTime() + Math.floor(Math.random() * 100000);
	    mockMongo.memoryStore[object._id] = object;
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
		    callback(null, [mockMongo.memoryStore[document._id]]);
		}
	    }
	},
    update: function(search, document, callback) {
        mockMongo.memoryStore[search._id] = document;
    }
    },
    createCollection: function(collectionName, callback) {
	callback(null, mockMongo.col);
    },

    collection: function(collectionName, callback) {
	callback(null, mockMongo.col);
    },
};

var before = function() {
    return new gamedb.GameDb(mockMongo);
};

var nonEmpty = function(possiblyEmpty) {
    return null != possiblyEmpty && undefined != possiblyEmpty;
};

module.exports = {
    'init returns game identifier': function() {
	before().init({ }, function(gameId){
	    assert.equal(true, nonEmpty(gameId) && 0  < gameId.length);
	});
    },

    'consecutive inits result in distinct game Ids': function() {
	var underTest = before();
	underTest.init({ }, function(game1) {
	    underTest.init({ }, function(game2) {
		assert.equal(false, game1 == game2);		
	    });
	});
    },

    'gamedb can recover game state from init': function() {
	var underTest = before();
        underTest.init({ }, function(gameId) { 
	    underTest.findGame(gameId, function(nick) {
		assert.equal(true, nonEmpty(nick));
	    });
	});
    },

    'gamedb recovers nickname from init': function() {
	var underTest = before();
	underTest.init({nickname: 'nick'}, function(gameId) {
	    underTest.findGame(gameId, function(obj) {
		assert.equal('nick', obj.nickname);
	    });
	});
    },

    'gamedb recovers board from init': function() {
	var underTest = before();
	underTest.init({board: [1,2,3]}, function(gameId) {
	    underTest.findGame(gameId, function(obj) {
		assert.deepEqual([1,2,3], obj.board);
	    });
	});
    },

    'gamedb can update board state': function() {
        var underTest = before();
        underTest.init({board: [1,2,3]}, function(gameId) {
            underTest.update(gameId, {board:[2,3,4]}, function(game) {
                underTest.findGame(gameId, function(obj) {
                    assert.deepEqual([2,3,4], obj.board);
                });
            });
        });
    }
};
