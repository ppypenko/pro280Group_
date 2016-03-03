"use strict";
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/data');
var fs = require('fs');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {

});
var userSchema = mongoose.Schema({
    UserName: String,
    Password: String
});
var User = mongoose.model('User', userSchema);

//--------------------inner functions---------------------------

function checkIfUserAlreadyExists(user) {
    var e;
    User.findOne({
        UserName: user
    }).lean().exec(function (err, item) {
        e = item;
    });
    return e !== null;
}

function deleteUsers() {
    User.remove({}, function (err) {
        console.log("removed");
    });
    User.find(function (err, users) {
        console.log(users);
    });
}


//------------------------exported functions--------------------------

exports.registerUser = function (username, password, verify) {
    if (checkIfUserAlreadyExists(username) && password !== verify) {
        return 1;
    } else if (checkIfUserAlreadyExists(username)) {
        return 2;
    } else if (password !== verify) {
        return 3;
    } else {
        var i = new User({
            UserName: username,
            Password: password
        });
        i.save(function (err, target) {
            if (err) {
                console.log(err);
            } else {
                console.log(target);
            }
        });
        return 0;
    }
};
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
exports.removeUser = function (id) {
    User.findOneAndRemove({
        _id: id
    }, function (err, user) {
        if (err) {
            throw err;
        }
        console.log('Deleted user');
        console.log(user);
    });
};