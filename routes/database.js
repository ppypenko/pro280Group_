"use strict";
var mongoose = require('mongoose'),
    fs = require('fs');
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

exports.cardTable = function (req, res) {
    Card.find(function (err, card) {
        if (card.count === 0) {
            console.log("empty");
        }
        res.render('cardTable', {
            card: card
        });
    });
};
exports.editCardPage = function (req, res) {
    Card.findOne({
        _id: req.params.id
    }, function (err, found) {
        if (err) {
            console.error(err);
        } else {
            res.render('editCard', {
                card: {
                    id: found.id,
                    text: found.text
                }
            });
        }
    });
};
exports.createCard = function (req, res) {
    var i = new Card({
        color: req.body.cardType,
        text: req.body.msgText,
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
    Card.find(function (err, card) {
        if (card.count === 0) {
            console.log("empty");
        }
        res.render('cardTable', {
            card: card
        });
        nodestream.emit('list', card);
    });
    res.redirect('/table');
};
exports.editCard = function (req, res) {
    Card.findOne({
        _id: req.params.id
    }, function (err, card) {
        if (err) {
            console.log(err);
        } else {
            card.text = req.body.msgText;
            card.save();
        }
    });
    res.redirect('/table');
};
exports.removeCard = function (req, res) {
    Card.findOneAndRemove({
        _id: req.params.id
    }, function (err, card) {
        if (err) {
            throw err;
        }
        console.log('Deleted card');
        console.log(card);
    });
    res.redirect('/table');
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

function updatePage() {

}