"use strict";
var mongoose = require('mongoose'),
    fs = require('fs'),
    blackCards = [],
    whiteCards = [];
mongoose.connect('mongodb://localhost/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});
var cardSchema = mongoose.Schema({
    color: String,
    text: String,
    created_on: Date,
    update_on: Date
});

var Card = mongoose.model('Card', cardSchema);
//--------------------inner functions----------------------------------

function getCard(color) {
    var i = 0;
    if (color === "Black") {
        i = Math.floor((Math.random() * blackCards.length));
        return blackCards.splice(i, 1);
    } else if (color === "White") {
        i = Math.floor((Math.random() * whiteCards.length));
        return whiteCards.splice(i, 1);
    }
    return "";
}

//--------------------exported functions--------------------------------

exports.getWhiteCard = function () {
    return getCard("White");
};
exports.getBlackCard = function () {
    return getCard("Black");
};

exports.startGame = function () {
    var black = Card.find({
            color: "Black"
        }),
        white = Card.find({
            color: "White"
        });
    black.exec(function (err, cards) {
        blackCards = cards;
        white.exec(function (err, cards) {
            whiteCards = cards;
        });
    });
};

exports.cardTable = function () {
    var query = Card.find(function (err, card) {
        if (card.count === 0) {
            console.log("empty");
        }
    });
    return query;
};
exports.editCardPage = function (id) {
    var query = Card.findOne({
        _id: id
    }, function (err, found) {
        if (err) {
            console.error(err);
        }
    });
    return query;
};
exports.createCard = function (body) {
    var i = new Card({
        color: body.cardType,
        text: body.msgText,
        created_on: new Date(),
        update_on: new Date()
    });
    i.save(function (err, target) {
        if (err) {
            console.log(err);
        } else {
            console.log(target);
        }
    });
    return i;
};
exports.editCard = function (id, msg) {
    Card.findOne({
        _id: id
    }, function (err, card) {
        if (err) {
            console.log(err);
        } else {
            card.text = msg;
            card.update_on = new Date();
            card.save();
        }
    });
};
exports.removeCard = function (id) {
    Card.findOneAndRemove({
        _id: id
    }, function (err, card) {
        if (err) {
            throw err;
        }
        console.log('Deleted card');
        console.log(card);
    });
};

exports.createDB = function () {
    var data = {};
    Card.count(function (err, count) {
        if (!err && count === 0) {
            var contents = fs.readFileSync("./routes/Card.json"),
                a = 0,
                i = {};
            data = JSON.parse(contents);
            for (a = 0; a < data.cards.length; a += 1) {
                i = new Card({
                    color: data.cards[a].color,
                    text: data.cards[a].text,
                    created_on: new Date(),
                    update_on: new Date()
                });
                i.save();
            }
        }
    });
};