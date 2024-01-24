let express = require('express');
let dotenv = require('dotenv');
let cors = require('cors');
const mongoose = require('mongoose');
const models = require("./models");

dotenv.config();

let app = express();
app.use(cors());

app.use(express.json());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the clients resource root
app.use(express.static("public"));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render("pages/index");
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// api

// create new Note
app.post('/api/note', function(req, res) {
    let sendStatus = 500; // pessismistic approach
    if (mongoose.connection.readyState === 1) {
        const note = new models.Note(req.body);
        try {
            note.save();
            sendStatus = 200;
        } catch (err) {
            console.error(err);
        }
    }
    res.sendStatus(sendStatus);
});

// get all Notes
app.get('/api/notes', function(req, res) {
    if (mongoose.connection.readyState === 1) {
        models.Note.find()
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }
});

let port = process.env.PORT || 8080;
app.listen(process.env.PORT, async () => {
    console.log("Connecting Mongo DB...");
    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: process.env.DB_NAME
    }).then(
        () => { console.log("Mongo DB connected."); },
        err => { console.error("There is an error: " + err); }
    );
});
console.log(`Server is listening on port ${port}.`);