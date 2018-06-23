module.exports = (req, res, next) => {
    req.checkBody('currentPassword', 'Fjalëkalimi aktual duhet plotësuar').notEmpty();
    req.checkBody('newPassword', 'Fjalëkalimi i ri nuk është valid, fjalëkalimi duhet më i madh se 6 karkatere!').isLength({ min: 6 });
    req.checkBody('newPasswordConfirm', 'Fjalëkalimet nuk përputhen!').equals(req.body.newPassword);

    var errors = req.validationErrors();

    if (notequals(req.body.currentPassword, req.body.newPassword)) {
        res.json({ errCmp: "Fjalëkalimi i ri nuk duhet të jet i njejtë me fjalëkalimin aktual!" });
    } else if (errors) {
        res.json({ errVld: errors });
    } else {
        next();
    }
}

const notequals = (current, password) => {
    if (current == password && current.length > 0 && password.length > 0) {
        return true; ƒ
    } else {
        return false;
    }
}