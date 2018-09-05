const fs = require('fs');
const path = require('path');

const SOURCE_PATH = 'ssr/';
const TARGET_PATH = 'public/';

const EN_FILENAME = 'index.en.html';
const SR_FILENAME = 'index.sr.html';

function copyFile(source, target, cb) {
    var cbCalled = false;
  
    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
      done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
      done(err);
    });
    wr.on("close", function(ex) {
      done();
    });
    rd.pipe(wr);
  
    function done(err) {
      if (!cbCalled) {
        cb(err);
        cbCalled = true;
      }
    }
  }

copyFile(path.join(__dirname, `${SOURCE_PATH}${EN_FILENAME}`), path.join(__dirname, `${TARGET_PATH}${EN_FILENAME}`), err => {
  if (err) {
    console.log(err);
  } else {
    console.log('index.en.html successfully copied into public');
  }
});
copyFile(path.join(__dirname, `${SOURCE_PATH}${SR_FILENAME}`), path.join(__dirname, `${TARGET_PATH}${SR_FILENAME}`), err => {
  if (err) {
    console.log(err);
  } else {
    console.log('index.sr.html successfully copied into public');
  }
});