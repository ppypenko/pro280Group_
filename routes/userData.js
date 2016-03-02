"use strict"
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');
const fs = require('fs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
    
});
var userSchema = mongoose.Schema({
    UserName : String,
    Password : String,
    EmailAddress : String
});
var User = mongoose.model('User', userSchema);

exports.editUser = function (userName) {
    var query = User.findOne({
        _id: userName
    }, function (err, found) {
        if (err) {
            console.error(err);
        }
    });
    return query;
};
exports.registerUser = function (body) {
    var i = new User({
        UserName: body.username,
        Password: body.Password
    });
    i.save(function (err, target) {
        if (err) {
            console.log(err);
        } else {
            console.log(target);
        }
    });
};
exports.removeUser = function (id) {
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