var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'conection error:'));
db.once('open', function (callback) {

});
var blackCardSchema = mongoose.Schema({
    text: String
});
var whiteCardSchema = mongoose.Schema({
    text: String
});
var Black = mongoose.model('Black', blackCardSchema),
    White = mongoose.model('White', whiteCardSchema);


exports.createCard = function (req, res) {
    var i = {};
    if (req.body.color === "black") {
        i = new Black({
            text: req.body.text
        });
    } else {
        i = new White({
            text: req.body.text
        });
    }
    i.save(new function (err, target) {
        if (err) {
            console.log(err);
        } else {
            console.log(target);
        }
    });

};
exports.editCard = function (req, res) {
    if (req.params.color === "black") {
        Black.findOne({
            _id: req.params.id
        }, function (err, black) {
            if (err) return console.error(err);
            black.text = req.params.text;
            black.save();
        });
    } else {
        White.findOne({
            _id: req.params.id
        }, function (err, black) {
            if (err) return console.error(err);
            black.text = req.params.text;
            black.save();
        });
    }
};
exports.removeCard = function (req, res) {

};
exports.createDB = function () {

};

function writeToFile(obj) {

}

function createDB() {

}