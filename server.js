let express = require('express');
let dotenv = require('dotenv');
let cors = require('cors');
const mongoose = require('mongoose');
const models = require("./models");

dotenv.config();

let app = express();
app.use(cors());

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set the clients resource root
app.use(express.static("public"));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    getNotes().then(function(foundNotes) {   
        res.render("pages/index", {
            notes: foundNotes 
        })
    })
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// "api"
async function getNotes() {
    const notes = await models.Note.find();
    return notes;
}

let port = process.env.PORT || 8080;
app.listen(process.env.PORT, async () => {
    console.log("Connecting Mongo DB...");
    mongoose.connect(process.env.CONNECTION_STRING, {
        dbName: process.env.DB_NAME
    }).then(
        () => { console.log("Mongo DB connected."); },
        err => { console.error(err); }
    );
});
console.log(`Server is listening on port ${port}.`);