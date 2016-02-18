"use strict";
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error:'));
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
        res.render('cardTable', {
            card: card
        });
    });
};

exports.createCard = function (req, res) {
    var i = new Card({
        color: req.body.color,
        text: req.body.text
    });
    i.save(function (err, target) {
        if (err) {
            console.log(err);
        } else {
            console.log(target);
        }
    });
    res.redirect('/cardTable');
};
exports.editCard = function (req, res) {
    Card.findone({
        _id: req.params.id
    }, function (err, card) {
        if (err) {
            console.log(err);
        } else {
            card.text = req.params.cardColor;
            card.save();
        }
    });
    res.redirect('/cardTable');
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
    res.redirect('/cardTable');
};


function writeToFile(obj) {

}

function createDB() {

}