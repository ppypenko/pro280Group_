"use strict";
var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express(),
    database = require('./routes/database.js'),
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


app.get('/table', database.cardTable);
app.get('/create', route.createCardPage);
app.post('/create', urlParser, database.createCard);
app.get('/edit/:id', urlParser, database.editCardPage);
app.post('/edit/:id', urlParser, database.editCard);
app.get('/remove/:id', database.removeCard);



//-----------------last line of code below----------------------------
//app.listen(3000);
var io - require('socket.io').listen(app.listen(3000));