"use strict";
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/data');
var usersArray = [];

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
exports.getAllUsers = function () {
    populateArray();
};

function populateArray() {
    var q = User.find({}),
        array = [];
    q.exec(function (err, users) {
        if (err) {
            console.log(err);
        }
        usersArray = users;
    });
}

function deleteUsers() {
    User.remove({}, function (err) {
        console.log("removed");
    });
    User.find(function (err, users) {
        console.log(users);
    });
    populateArray();
}

function findUser(user) {
    var i = 0;
    for (i = 0; i < usersArray.length; i += 1) {
        return (usersArray[i].UserName === user) ? true : false;
    }
}

function findPassword(user, password) {
    var i = 0;
    for (i = 0; i < usersArray.length; i += 1) {
        return (usersArray[i].UserName === user && usersArray[i].Password === password) ? true : false;
    }
}

//------------------------exported functions--------------------------
exports.loginUser = function (user, password) {
    console.log(findUser(user));
    if (!findUser(user)) {
        return "Error! User does not exist.";
    } else if (!findPassword(user, password)) {
        return "Error! Password incorrect.";
    } else {
        return "";
    }
};

exports.registerUser = function (username, password, verify) {
    if (!findUser(username) && password !== verify) {
        return "Error! User already exists. Error! Password and Verification do not match.";
    } else if (!findUser(username)) {
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
        populateArray();
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
    populateArray();
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
    populateArray();
};