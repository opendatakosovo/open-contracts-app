const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");
const morgan = require('morgan');

require('dotenv').config();


// DB connection
mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
  console.log("Connected to database!");
});

const app = express();

// Passing Passport module to configure authentication middleware
require('./config/passport')(passport); // pass passport for configuration

// Port number
const port = 3000;

// Validation
const validator = require('express-validator');
app.use(validator());

// CORS middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(bodyParser.json());

// Index Route
app.get("/", (req, res) => {
  res.send("Invalid");
});

// Log every request into console
app.use(morgan('dev'));

// Registering all controllers
app.use(require('./controllers'));

// Route all upload files
app.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `uploads/${req.params.filename}`));
})

// Route all old dataset files
app.get('/importer/data/old/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `importer/data/old/${req.params.filename}`));
})

// Route all new dataset files
app.get('/importer/data/new/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `importer/data/new/${req.params.filename}`));
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log("Server started on port:" + port);
});
