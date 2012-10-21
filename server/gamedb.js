"use strict";

var GameDb = function(db) {
    this.db = db;
};

GameDb.prototype.init = function(game, callback) {
    var that = this;
    this.db.createCollection('games', function(err, col) {
        that.db.collection('games', function(err, col) {
            col.insert(game, {safe:true}, function() { 
                removeUnderscore(game);
                callback(game.id); 
            });
        });
    });
};

GameDb.prototype.update = function(id, game, callback) {
    var that = this;
    this.db.collection('games', function(err, col) {
        var updateGame = removeId(game);

        col.update({'_id': col.db.bson_serializer.ObjectID.createFromHexString(id)}, updateGame, function() {
            callback(game);
        });
    });
};
	
GameDb.prototype.findGame = function(id, callback) {
    this.db.collection('games', function(err, col) {
        col.find({'_id': col.db.bson_serializer.ObjectID.createFromHexString(id)}).toArray(function(err, results) {
            var game = null;
            if (0 !== results.length) {
                game = results[0];
            }
            callback(removeUnderscore(game));
        });
    });
};

var removeUnderscore = function(json) {
    var id = json._id;
    json.id = id;
    delete json._id;
    return json;
};

var removeId = function(json) {
    var copy = JSON.parse(JSON.stringify(json));
    delete copy.id;
    return copy;
};

exports.GameDb = GameDb;
