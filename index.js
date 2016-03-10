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
    userDatabase = require('./routes/userData.js'),
    pi = require('./routes/PI.js'),
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
app.use(expressSession({
    secret: "S3Cr3TM3zz3G3",
    saveUninitialized: true,
    resave: true
}));

var accessChecker = function (req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

//database.createDB();
database.startGame();
app.get('/', function (req, res) {
    var piValue = pi.PI(500).toString().substring(0, 102);
    //console.log(piValue.toString());
    res.render('main', {
        PI: piValue
    });
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("logged out");
            res.redirect('/');
        }
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
app.post('/login', urlParser, function (req, res) {
    var move = userDatabase.loginUser(req.body.user, req.body.password);
    if (move === "") {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        };
        res.redirect('/');
    } else {
        res.render('login', {
            errorMsg: move
        });
    }
});

app.get('/signUp', route.signUpPage);
app.post('/signUp', urlParser, function (req, res) {
    var move = userDatabase.registerUser(req.body.username, req.body.password, req.body.verify);
    if (move === "") {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        };
        res.redirect('/');
    } else {
        res.render('register', {
            errorMsg: move
        });
    }
});

app.get('/play', route.cardGamePage);

//---------------------CRUD operations routes and actions--------------------
app.get('/create', accessChecker, route.createCardPage);
app.post('/create', accessChecker, urlParser, function (req, res) {
    var card = database.createCard(req.body);
    res.redirect('/table');
    io.emit('newCard', {
        card: card
    });
});
app.get('/edit/:id', accessChecker, urlParser, function (req, res) {
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
app.post('/edit/:id', accessChecker, urlParser, function (req, res) {
    database.editCard(req.params.id, req.body.msgText);
    res.redirect('/table');
    io.emit('editCard', {
        id: req.params.id,
        msg: req.body.msgText
    });
});
app.get('/remove/:id', accessChecker, function (req, res) {
    database.removeCard(req.params.id);
    res.redirect('/table');
    io.emit('removeCard', {
        id: req.params.id
    });
});


//-----------------last line of code below----------------------------
server.listen(3000);