
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    
});

var personSchema = mongoose.Schema({
    name: String,
    age: String,
    zombie: Boolean,
    created_at: Date,
    updated_at: Date
});



// NOTE: methods must be added to the schema before compiling it with mongoose.model()
personSchema.methods.speak = function () {
    var greeting;
    if(this.zombie) {
        greeting = "Braaaaaains!!!";
    } else {
        greeting = this.name
        ? "Hi, I'm " + this.name + "."
        : "I have forgotten my name. Can you help me?";
    }
    console.log(greeting);
}
var Person = mongoose.model('Person', personSchema);
/*
var fred = new Person({ name: 'Fred', age: 32, zombie: false });
console.log(fred.name); // "Hi, I'm Fred."

var bob = new Person({ name: 'Bob', age: 43, zombie: false });
bob.speak(); // "Hi, I'm Bob."

var confused_person = new Person({ zombie: false });
confused_person.speak(); // "I have forgotten my name. Can you help me?"

var suzette = new Person({ name: 'Suzette', age: 21, zombie: true });
suzette.speak(); // "Hi, I'm Bob."
*/

// Create - Save a person to database 
/*
bob.save(function (err, bob) {
  if (err) return console.error(err);
  console.log('person added');
});
*/

// Read
Person.findOne({ name: 'Bob' }, function(err, person) {
    if (err) return console.error(err);
    console.log('Find one that matches');
    console.log(person);
});

Person.find({ name: 'Bob' }, function(err, person) {
    if (err) return console.error(err);
    console.log('Find all that match');
    console.log(person);
});

Person.find(function (err, person) {
    if (err) return console.error(err);
    console.log('Show all');
    console.log(person);
});


// Update
/*
Person.findOne({ name: 'Bob' }, function(err, person) {
    if (err) return console.error(err);
    person.name = 'Bob Zombie';
    person.zombie = true;
    
    person.save(function (err, bob) {
        if (err) return console.error(err);
        console.log('person updated');
        console.log(person);
    });
    
});
*/

// Delete
/*
Person.findOneAndRemove({ name: 'Bob Zombie' }, function(err, person) {
    if (err) throw err;
    console.log('Deleted person');
    console.log(person);
});
*/


// Shows all
/*Person.find(function (err, person) {
  if (err) return console.error(err);
  console.log(person);
});*/