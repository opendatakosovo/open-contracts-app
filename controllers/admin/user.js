const router = require("express").Router();
const User = require('../../models/user');

//Route for creating a user
router.post('/', (req, res) => {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
        deparment: req.body.deparment
    });

    User.addUser(user, (err, user) => {
        if (!err) {
            res.json({
                "msg": "User has been added successfully",
                "user": user
            });
        } else {
            res.json({
                "err": err
            });
        }
    });
});

router.get('/', (req, res) => {
    User.getAllUsers((err, users) => {
        if (!err) {
            res.json({
                "msg": "Users has been retrived sucessfully",
                "users": users
            });
        } else {
            res.json({
                "err": err
            });
        }
    });
});

module.exports = router;