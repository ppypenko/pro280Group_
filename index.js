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

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname + '/public')));
app.use(cookieParser());
app.use(expressSession({
    secret: "secret",
    saveUninitialized: true,
    resave: true
}));

//app.get('/', function (req, res) {
//    res.render('table');
//});


app.get('/table', database.cardTable);
app.get('/create', route.createCardPage);




//-----------------last line of code below----------------------------
app.listen(3000);