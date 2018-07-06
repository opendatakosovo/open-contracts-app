module.exports = (req, res, next) => {
    req.checkBody('directorateName', 'Drejtoria duhet plotësuar!').notEmpty();
    req.checkBody('thePersonInChargeEmail', 'Ju duhet te zgjedhni nje drejtorë!').notEmpty();
    var error = req.validationErrors();

    if(error) {
        res.json({
            errVld: error,
        });
    } else {
        next();
    }
}