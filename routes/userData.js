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
    User.findOne({
        UserName: user
    }).lean().exec(function (err, item) {
        return item;
    });
}

function deleteUsers() {
    User.remove({}, function (err) {
        console.log("removed");
    });
    User.find(function (err, users) {
        console.log(users);
    });
}

function findUser(user) {
    User.findOne({
        UserName: user
    }).lean().exec(function (err, item) {
        return item;
    });
}

function findPassword(user, password) {
    User.findOne({
        UserName: user,
        Password: password
    }).lean().exec(function (err, item) {
        return item;
    });
}

//------------------------exported functions--------------------------
exports.loginUser = function (user, password) {
    console.log(findUser(user));
    if (findUser(user) === null) {
        return "Error! User does not exist.";
    } else if (findPassword(user, password) === null) {
        return "Error! Password incorrect.";
    } else {
        return "";
    }
};

exports.registerUser = function (username, password, verify) {
    if (checkIfUserAlreadyExists(username) !== "" && password !== verify) {
        return "Error! User already exists. Error! Password and Verification do not match.";
    } else if (checkIfUserAlreadyExists(username) !== "") {
        return "Error! User already exists.";
    } else if (password !== verify) {
        return "Error! Password and Verification do not match.";
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
        return "";
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