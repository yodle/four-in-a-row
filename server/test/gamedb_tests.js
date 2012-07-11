var gamedb = require('../gamedb');
var assert = require('assert');

var mockMongo = { 
	db: {
	},
	collection: {
		insert: function(object) {
			mockMongo.db[object.gameId] = object;
		}
	},
	client: {
		createCollection: function(collectionName, callback) {
			callback(null, mockMongo.collection);
		},
		collection: function(collectionName, callback) {
			callback(null, mockMongo.collection);
		},
		find: function(document, callback) {
			callback(null, [mockMongo.db[document.gameId]]);
		}
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
	var underTest = before();
	var gameId = underTest.init('dennis');
	assert.equal(true, nonEmpty(gameId) && 0  < gameId.length);
    },

    'consecutive inits result in distinct game Ids': function() {
	var underTest = before();
	var game1 = underTest.init('dennis');
	var game2 = underTest.init('fend');
	assert.equal(false, game1 == game2);
    },

    'gamedb can recover game state from init': function() {
	var underTest = before();
	var gameId = underTest.init('dennis');
	underTest.findGame(gameId, function(nick) {
		assert.equal(true, nonEmpty(nick));
	});
    },

    'gamedb recovers nickname from init': function() {
	var underTest = before();
	var gameId = underTest.init('nick');
	
	underTest.findGame(gameId, function(obj) {
		assert.equal('nick', obj.nickname);
	});
    }
};
