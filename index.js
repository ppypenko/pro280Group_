"use strict";
var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express(),
    database = require('./routes/cardDataBase.js'),
    route = require('./routes/routes.js'),
    urlParser = bodyParser.urlencoded({
        extended: false
    });
exports.getApp = function () {
    return app;
};
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser());
app.use(expressSession({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

database.createDB();


app.get('/table', function (req, res) {
    var d = database.cardTable();
    d.exec(function (err, card) {
        res.render('cardTable', {
            card: card
        });
    });
});
app.get('/create', route.createCardPage);
app.post('/create', urlParser, function (req, res) {
    database.createCard(req.body);
    res.redirect('/table');
});
app.get('/edit/:id', urlParser, function (req, res) {
    var d = database.editCardPage(req.params.id);
    d.exec(function (err, found) {
        res.render('editCard', {
            card: {
                id: found.id,
                text: found.text
            }
        });
    });
});
app.post('/edit/:id', urlParser, function (req, res) {
    database.editCard(req.params.id, req.body.msgText);
    res.redirect('/table');
});
app.get('/remove/:id', function (req, res) {
    database.removeCard(req.params.id);
    res.redirect('/table');
});



//-----------------last line of code below----------------------------
app.listen(3000);
//var io - require('socket.io').listen(app.listen(3000));