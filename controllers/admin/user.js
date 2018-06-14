const router = require("express").Router();
const User = require('../../models/user');
const userValidation = require("../../middlewares/user_validation");

/*
 * ENDPOINTS PREFIX: /user
 */

// Route for creating a user
router.post('/', userValidation, (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
        role: req.body.role,
        department: req.body.department
    });

    User.findUserByEmail(user.email, (err, userExists) => {
        if(!err) {
            if(userExists) {
                res.json({
                    "msg":"This is user exist",
                    "exists": true
                });
            } else {
                User.addUser(user, (err, user) => {
                    if (!err) {
                        res.json({
                            "msg": "User has been added successfully",
                            "user": user,
                            "success": true
                        });
                    } else {
                        res.json({
                            "err": err,
                            "success": false
                        });
                    }
                });
            }
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for getting all users
router.get('/', (req, res) => {
    User.getAllUsers((err, users) => {
        console.log(users);
        if (!err) {
            res.json({
                "msg": "Users has been retrived successfully",
                "users": users,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for getting a user by id
router.get('/:id', (req, res) => {
    User.getUserById(req.params.id, (err, user) => {
        if(!err){
            res.json({
                "msg": "User by id has been retrived successfully",
                "user": user,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for deleting a user by id
router.delete('/:id',(req, res) => {
    User.deleteUserById(req.params.id, (err, user) => {
        if(!err){
            res.json({
                "msg": "User has been deleted successfully",
                "user": user,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

module.exports = router;