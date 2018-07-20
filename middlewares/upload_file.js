const multer = require('../utils/storage');
const upload = multer.single('file');
module.exports = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType.indexOf('application/json') == -1) {
        upload(req, res, err => {
            if (err) {
                res.json({
                    "errFileUpload": err
                });
            } else {
                return next();
            }
        });
    } else {
        return next();
    }
}