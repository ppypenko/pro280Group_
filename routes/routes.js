"use strict";

exports.cardTablePage = function (req, res) {
    res.render('cardTable');
};

exports.signUpPage = function (req, res) {
    res.render('register');
};
exports.loginPage = function (req, res) {
    res.render('login');
};

//must adjust the following methods for their page.
exports.forumPage = function (req, res) {
    res.render('main');
};
exports.forumTablePage = function (req, res) {
    res.render('main');
};

exports.createCardPage = function (req, res) {
    res.render('createCard');
};
exports.cardGamePage = function (req, res) {
    res.render('cardGame');
};