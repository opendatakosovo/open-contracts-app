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
                    cb(null, true);
                } else {
                    const filename = {
                        name: file.originalname.split('.')[0],
                        type: file.originalname.split('.')[1]
                    };
                    fs.rename(`./prishtina-contracts-importer/data/procurements/new/${file.originalname}`, `./prishtina-contracts-importer/data/procurements/new/${filename.name}-backup.${filename.type}`, err => {
                        if (err) {
                            req.fileRenameError = err;
                            return cb(null, false);
                        } else {
                            req.fileExist = {
                                "exist": true,
                                "year": parseInt(file.originalname.split('.'))
                            }
                            return cb(null, true);
                        }
                    });
                }
            });
        }
    }

});