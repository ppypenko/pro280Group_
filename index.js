"use strict";
var http = require('http'),
    express = require('express'),
    jade = require('jade'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    app = express(),
    database = require('./routes/cardDataBase.js'),
    route = require('./routes/routes.js'),
    server = http.createServer(app),
    io = require('socket.io')(server),
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

database.createDB();

app.get('/index', function (req, res) {
    var bc = database.BlackCardArray();
    bc.exec(function (err, card) {
        res.render('main', {
            
        });
    });
});

app.get('/table', function (req, res) {
    var d = database.cardTable();
    d.exec(function (err, card) {
        res.render('cardTable', {
            card: card
        });
    });
});

app.get('/login', route.loginPage);

app.get('/signUp', route.signUpPage);

app.get('/play', route.cardGamePage);

//CRUD operations routes and actions
app.get('/create', route.createCardPage);
app.post('/create', urlParser, function (req, res) {
    var card = database.createCard(req.body);
    res.redirect('/table');
    io.emit('newCard', {
        card: card
    });
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
    io.emit('editCard', {
        id: req.params.id,
        msg: req.body.msgText
    });
});
app.get('/remove/:id', function (req, res) {
    database.removeCard(req.params.id);
    res.redirect('/table');
    io.emit('removeCard', {
        id: req.params.id
    });
});


//-----------------last line of code below----------------------------
server.listen(3000);