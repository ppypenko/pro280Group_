"use strict";
var mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost/data');

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

function deleteUsers() {
    User.remove({}, function (err) {
        console.log("removed");
    });
    User.find(function (err, users) {
        console.log(users);
    });
}

//------------------------exported functions--------------------------

exports.loginUser = function (user, password) {
    var q1 = User.find({
            UserName: user
        }),
        q2 = User.find({
            UserName: user,
            Password: password
        });
    q1.exec(function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            q2.exec(function (err2, user2) {
                if (err2) {
                    console.log(err2);
                }
                if (user2) {
                    return "";
                } else {
                    return "Error! Password incorrect.";
                }
            });
        } else {
            return "Error! User does not exist.";
        }
    });
};

exports.registerUser = function (username, password, verify) {
    var q1 = User.find({
        UserName: username
    });
    q1.exec(function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user && password !== verify) {
            return "Error! User already exists. Error! Password and Verification do not match.";
        } else if (user) {
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
    });
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