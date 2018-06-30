const router = require("express").Router();
const User = require('../../models/user');
const mailTransporter = require('../../utils/mail-transporter');
const passwordGenerator = require('../../utils/generate-password');
const passport = require("passport");
const userValidation = require("../../middlewares/user_validation");
const checkCurrentPassword = require('../../middlewares/check_current_password');
const changePasswordValidation = require('../../middlewares/change_password_validation');
const checkCurrentUser = require('../../middlewares/check_current_user');
/*
 * ENDPOINTS PREFIX: /user
 */

// Route for creating a user
router.post('/', passport.authenticate('jwt', { session: false }), userValidation, checkCurrentUser, (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
        role: req.body.role,
        department: req.body.department,
        isActive: true
    });

    User.findUserByEmail(user.email, (err, userExists) => {
        if (!err) {
            if (userExists) {
                res.json({
                    "msg": "This user exist",
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
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.getAllUsers((err, users) => {
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
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.getUserById(req.params.id, (err, user) => {
        if (!err) {
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
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.deleteUserById(req.params.id, (err, user) => {
        if (!err) {
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

// Route for generate  password for a user
router.put('/generate-password/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let password = passwordGenerator.generate();
    User.changePassword(req.params.id, password, (err, user) => {
        if (!err) {
            console.log(user.email);
            const mail = {
                to: user.email,
                from: "support@prishtina.com",
                subject: "Ju është ndryshuar fjalëkalimi nga adminstruesi",
                html: `I/e nderuar,
                        <br>
                        Adminstratori i platformës e ka ndryshuar fjalëkalimin e juaj me sukses. <br>
                        </br>
                        Fjalëkalimi i juaj i përkohshëm është: <br/>
                        <h3><b>${password}</b></h3> 
                        <br>
                        Ju lutem ndryshoni fjalëkalimin pas kyçjes së parë!<br>
                        <br>
                        Me Respekt,<br>
                        Administratori`
            }
            mailTransporter.sendMail(mail, err => {
                if (!err) {
                    res.json({
                        "msg": "User's password changed and mail has been sent successfully",
                        "user": user,
                        "success": true
                    });
                } else {
                    res.json({
                        "err": ` Mail hasn't been sent successfully  | error: ${err}`,
                        "success": false
                    });
                }
            })
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// UPDATE USER DATA BY ID
router.put('/edit-user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userId = req.params.id;

    User.updateUser(userId, req.body, (err, user) => {
        if (!err) {
            res.json({
                "msg": "User has been updated successfully",
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

// Change password  for logged in user 
router.put('/change-password', passport.authenticate('jwt', { session: false }), changePasswordValidation, checkCurrentPassword, (req, res) => {
    User.changePassword(req.user._id, req.body.newPassword, (err, user) => {
        if (!err) {
            res.json({
                "msg": "Your password has been changed successfully",
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

// Deactivate user by id
router.put('/deactivate-user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userId = req.params.id;

    User.deactivateUser(userId, (err, user) => {
        if (!err) {
            res.json({
                "msg": "User has been deactivated successfully",
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

// Activate user by id
router.put('/activate-user/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    User.activateUser(req.params.id, (err, user) => {
        if (!err) {
            res.json({
                "msg": "User has been activated successfully",
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