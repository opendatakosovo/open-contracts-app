module.exports = (req, res, next) => {
    req.checkBody('comment', 'Duhet të shtypni një mesazh!').notEmpty();
    var error = req.validationErrors();

    if(error) {
        res.json({
            errVld: error,
        });
    } else {
        next();
    }
}