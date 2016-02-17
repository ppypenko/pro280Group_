var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express(),
    route = require('./routes/database.js'),
    urlParser = bodyParser.urlencoded({
        extended: false
    });

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser());
app.use(expressSession({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));









//-----------------last line of code below----------------------------
app.listen(3000);