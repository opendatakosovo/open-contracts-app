const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const cheerio = require('cheerio');
const socialMetaData = require('./social-meta');
require('dotenv').config();

// DB connection
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("Successfully connected to database!");
}).catch(err => {
  console.log('Couldn\'t connect to DB! Error: ', err);
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
app.use(bodyParser.urlencoded({ extended: true }))

app.use(helmet());

// Index Route
app.get("/", (req, res) => {
  res.send("Loading...");
});

// Log every request into console
app.use(morgan('dev'));

// Registering all controllers
app.use(require('./controllers'));

// Route all upload files
app.get('/uploads/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `uploads/${req.params.filename}`));
})

// Route all documents files
app.get('/documents/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `documents/${req.params.filename}`));
})

// Route all dataset files
app.get('/datasets/:folder/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, `prishtina-contracts-importer/data/procurements/${req.params.folder}/${req.params.filename}`));
});

function serverRender(res, lang) {
  fs.readFile(path.join(__dirname, 'public/index.html'), 'utf8', (err, html) => {
    if (err) throw err;
    const $ = cheerio.load(html.toString());

    $('#fb-title').replaceWith(`<meta property="og:title" content="${socialMetaData[lang]['title']}">`);
    $('#fb-site-name').replaceWith(`<meta property="og:site_name" content="${socialMetaData[lang]['title']}">`);
    $('#fb-description').replaceWith(`<meta property="og:description" content="${socialMetaData[lang]['description']}">`);
    $('#fb-img').replaceWith(`<meta property="og:image:url" content="${socialMetaData[lang]['img']}">`);
    $('#fb-url').replaceWith(`<meta property="og:url" content="https://kontratatehapura.prishtinaonline.com/${lang}">`);

    $('#tw-title').replaceWith(`<meta property="twitter:title" content="${socialMetaData[lang]['title']}">`);
    $('#tw-description').replaceWith(`<meta property="twitter:description" content="${socialMetaData[lang]['description']}">`);
    $('#tw-img').replaceWith(`<meta property="twitter:image" content="${socialMetaData[lang]['img']}">`);

    res.send($.html());
  });
}

app.get('*', (req, res) => {
  let lang = req.originalUrl.replace('/', '');

  if (lang == 'en' || lang == 'sr') {
    serverRender(res, lang);
  } else {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log("Server started on port: " + port);
});