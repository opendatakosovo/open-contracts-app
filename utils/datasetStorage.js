const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './prishtina-contracts-importer/data/procurements/new/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

function fileNameRegexValidation(year) {
    return /^(201[8-9])|(20[2-9][0-9])|(21[0-9][0-9])$/.test(year);
}

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype != "text/csv") {
            req.typeValidation = "Dateset file type is wrong, you can only upload";
            return cb(null, false);
        } else if (!fileNameRegexValidation(file.originalname.split(".")[0])) {
            req.nameValidation = "Dataset is old or dataset name is invalid";
            return cb(null, false);
        } else {
            fs.access(`./prishtina-contracts-importer/data/procurements/new/${file.originalname}`, err => {
                if (err) {
                    cb(null, true);
                } else {
                    req.fileExist = "Dataset exsist";
                    return cb(null, false);
                }
            });
        }
    }

});