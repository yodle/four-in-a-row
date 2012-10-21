"use strict";

var MessagesDb = function(db) {
    this.db = db;
};

var DEF_ERR_MSG = "Well this is embarassing. Something went wrong with our server.";
var GOOD_ENOUGH_MOVES = 35;

MessagesDb.prototype.find = function(level, moves, win, manual, callback) {
    var that = this;
    if(typeof(manual) !== "boolean") { manual = true; }
    this.db.collection('messages', function(err, col) {
        if (win) {
            col.find( { 'win' : win, 'manual' : manual }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db); });
        } else {
            if (parseInt(moves, 10) > GOOD_ENOUGH_MOVES) {
                col.find( { 'win' : win, 'enoughMoves' : true }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db); });
            } else {
                col.find( { 'win' : win, 'enoughMoves' : false }, { 'template' : 1 }).toArray(function(err, results) { findLevelCode(results, callback, level, win, that.db); });
            }
        }
    });
};

var findLevelCode = function(results, callback, level, win, db) {
    if (results.length === 0) {
        callback({ 'message' : DEF_ERR_MSG });
    }
    else {
        var template = results[0].template;
        db.collection('messages', function(err, col) {
            if (win) {
                col.find({ 'ai' : parseInt(level, 10) }, { 'win' : 1 }).toArray(function(err, results) { generateMessage(results, callback, level, template); });
            } else {
                col.find({ 'ai' : parseInt(level, 10) }, { 'loss' : 1 }).toArray(function(err, results) { generateMessage(results, callback, level, template); });
            }
        });
    }
};

var generateMessage = function(results, callback, level, template) {
    if (results.length === 0) {
        callback({ 'message' : DEF_ERR_MSG });
    }
    else {
        var message= template.replace('$', level);
        if (results[0].win !== undefined) {
            message= message.replace(/XXXXXXXXX/g, results[0].win);
        } else {
            message= message.replace(/XXXXXXXXX/g, results[0].loss);
        }
        callback({ 'message' : message});
    }
};

exports.MessagesDb = MessagesDb;

