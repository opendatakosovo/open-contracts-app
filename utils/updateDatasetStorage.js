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

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype != "text/csv") {
            req.typeValidation = "Dateset file type is wrong, you can only upload";
            return cb(null, false);
        } else if (parseInt(file.originalname.split(".")[0]) < 2016) {
            req.nameValidation = "Dataset is old or dataset name is invalid";
            return cb(null, false);
        } else {
            fs.access(`./prishtina-contracts-importer/data/procurements/new/${file.originalname}`, err => {
                if (err) {
                    req.fileDoesntExist = "Dataset cannot updated because doesn't exist";
                    return cb(null, false);
                } else {
                    return cb(null, true);
                }
            });
        }
    }

});