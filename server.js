let express = require('express');
let dotenv = require('dotenv');
let cors = require('cors');
let mongodb = require('mongodb');

dotenv.config();

let app = express();
app.use(cors());

let database = null;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index', {
        notes: getNotes()
    });
});

// about page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// "api"
function getNotes() {
    let res = [];
    if (database) {
        res = database.collection("todoappcollection").find({}).toArray();    
    }
    return res;
}

let port = process.env.PORT || 8080;
app.listen(process.env.PORT, () => {
    console.log("Trying to connect Mongo DB...");
    mongodb.MongoClient.connect(process.env.CONNECTION_STRING, (error, client) => {
        if (error) {
            console.error("Can't connect to Mongo DB.")
            console.error(error);
        } else {
            database = client.db(process.env.DATABASE_NAME);
            console.log("Mongo DB connection successfull!");
        }
    });
});
console.log(`Server is listening on port ${port}.`);