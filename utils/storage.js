const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype != "application/pdf") {
            req.typeValidation = "Document file type is wrong, you can only upload pdf file!";
            return cb(null, false);
        } else {
            console.log(file.originalname);
            fs.access(`./uploads/${file.originalname}`, err => {
                if (err) {
                    cb(null, true)
                } else {
                    req.fileExist = "File exists";
                    cb(null, false)

                }
            })
        }
    }
});