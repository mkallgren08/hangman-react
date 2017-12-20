const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");

const PORT = process.env.PORT || 3001;
const app = express();

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// Add routes, both API and view


// Serve up static assets (usually on heroku)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("client/build"));
// }
// Serve up static assets (usually on heroku)
app.use(express.static("client/build"));
app.use(routes);

// Set up promises with mongoose
mongoose.Promise = global.Promise;

// Declare Mongoose Connection Parameters

// "mongodb://heroku_cwf2cqkx:8vpi8pekalrvhlae96mahc4ktq@ds153494.mlab.com:53494/heroku_cwf2cqkx"

const mongoConnect = 'mongodb://localhost/hangman_options' || process.env.MONGODB_URI
// Connect to the Mongo DB
mongoose.connect(
  mongoConnect, {
    useMongoClient: true
  }
);

const db = mongoose.connection;

// Show any mongoose errors
db.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function () {
  console.log(`Mongoose connection to ${mongoConnect} successful.`);
});

// Send every request to the React app
// Define any API routes before this runs
// app.get("*", function(req, res) {
//   res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
