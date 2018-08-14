const router = require("express").Router();
const User = require('../../models/user');
const mailTransporter = require('../../utils/mail-transporter');
const passwordGenerator = require('../../utils/generate-password');
const passport = require("passport");
const userValidation = require("../../middlewares/user_validation");
const checkCurrentPassword = require('../../middlewares/check_current_password');
const changePasswordValidation = require('../../middlewares/change_password_validation');
const checkCurrentUser = require('../../middlewares/check_current_user');
const authorization = require('../../middlewares/authorization');
const async = require('async');
const crypto = require('crypto');
/*
 * ENDPOINTS PREFIX: /user
 */

// Route for creating a user
router.post('/', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), userValidation, checkCurrentUser, (req, res) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
        role: req.body.role,
        directorateName: req.body.directorateName,
        isInCharge: req.body.isInCharge,
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

// Get all simple active users
router.get('/simple-users', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {
    User.getAllSimpleUsers()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

// Route for getting all users
router.get('/', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {
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

router.get('/active-users', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {
    User.activeUsers((err, users) => {
        if (!err) {
            res.json({
                "msg": "Active users has been retrived succesfully",
                "users": users,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": true
            });
        }
    });
});

// Route for getting a user by id
router.get('/:id', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin", "user"), (req, res) => {
    User.getUserById(req.params.id, (err, user) => {
        if (!err) {
            res.json({
                "msg": "User has been retrived successfully",
                "user": user,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for deleting a user by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {
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
router.put('/generate-password/:id', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {
    let password = passwordGenerator.generate();
    User.changePassword(req.params.id, password, (err, user) => {
        if (!err) {
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
router.put('/edit-user/:id', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin", "user"), (req, res) => {
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
router.put('/change-password', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin", "user"), changePasswordValidation, checkCurrentPassword, (req, res) => {
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

// Activate user by id
router.put('/activate-user/:id', passport.authenticate('jwt', { session: false }), authorization("superadmin", "admin"), (req, res) => {

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

router.post("/send-email-for-regeneration", (req, res) => {
    User.findRegularUserAndAdminsByEmail(req.body.email, (err, user) => {
        if (!err) {
            if (user) {
                User.getSuperadmin()
                    .then(superadmin => {
                        const mail = {
                            to: superadmin.email,
                            from: "support@prishtina.com",
                            subject: `Kërkes për ndryshim fjalëkalimi nga ${user.firstName} ${user.lastName}  `,
                            html: `I/e nderuar,
                                    <br>
                                    <br>
                                    ${user.firstName} ${user.lastName} me email ${user.email} kërkon të i ndryshohet fjalëkalimi.
                                    <br>
                                    <br>
                                    Linku për rigjenerim të fjalëkalimit: <a href='${req.headers.origin}/dashboard/users'>${req.headers.origin}/dashboard/users</a>.
                                    <br>
                                    <br>
                                    Me Respekt,<br>
                                    ${user.firstName} ${user.lastName}`
                        }
                        mailTransporter.sendMail(mail).then(() => {
                            res.json({
                                "msg": "User's request for password change mail has been sent successfully",
                                "user": user,
                                "success": true
                            });
                        }).catch(err => {
                            res.json({
                                "err": ` Mail hasn't been sent successfully  | error: ${err}`,
                                "success": false
                            });
                        })
                    })
                    .catch(err => {
                        res.json({
                            "err": err,
                            "success": false
                        });
                    })
            } else {
                res.json({
                    "userExist": "User doesn't exist", "success": false
                })
            }
        } else {
            {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        }
    });
});

router.post('/reset-password', (req, res, cb) => {
    async.waterfall([
        done => {
            crypto.randomBytes(20, (err, buf) => {
                const token = buf.toString('hex');
                done(err, token);
            })
        },
        (token, done) => {
            User.getSuperadmin().then(superadmin => {
                superadmin.resetPasswordToken = token;
                superadmin.resetPasswordExpires = Date.now() + 1800000

                superadmin.save(err => {
                    done(err, token, superadmin);
                });
            }).catch(err => {
                console.log(err);
            })
        },
        (token, superadmin, done) => {
            var mailOptions = {
                to: superadmin.email,
                from: 'support@prishtina.com',
                subject: ' Rivendosja e fjalëkalimit',
                text: 'Ju keni pranuar këtë mesazh sepse ju (apo dikush tjetër) keni kërkuar të ndryshoni fjalëkalimin.\n\n' +
                    'Ju lutemi klikoni në linkun e mëposhtëm për të vazhduar me proceduren e rivendosjes së fjalëkalimit: \n\n' +
                    'http://' + req.headers.origin + '/change-password/' + token + '\n\n' +
                    'Nëse ju nuk e keni kërkuar këtë email ju lutemi ta injoroni, fjalëkalimi do të mbetet i njëjtë.\n'
            };
            mailTransporter.sendMail(mailOptions, err => {
                res.json({
                    'status': 'ok',
                    'message': 'Udhëzimet për rivendosje të fjalëkalimit janë dërguar tek ' + superadmin.email + '.'
                });
            });
        }
    ], err => {
        if (err) {
            cb(err);
        } else {
            res.json({
                "redirect": "redirect"
            })
        }
    });
});

router.get('/change-password-admin/:token', (req, res) => {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (req, user) => {
        if (!user) {
            res.json({ redirect: true })
        } else {
            res.json({ redirect: false })
        }
    })
});

router.post('/change-password-admin/:token', (req, res) => {
    async.waterfall([
        done => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
                if (!user) {
                    return res.json({
                        'status': 'error',
                        'message': 'Tokeni për rivendosjen e fjalëkalimit ka skaduar!'
                    });
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(err => {
                    if (!err) {
                        res.json({
                            'success': true,
                            "msg": 'Password has been changed'
                        })
                    }
                });
            });
        },
        (user, done) => {
            var mailOptions = {
                to: user.email,
                from: 'support@prishtina.com',
                subject: 'Fjalëkalimi është ndryshuar me sukses',
                text: 'Përshëndetje,\n\n' +
                    'Ky është një email që konfirmon ndryshimin e fjalëkalimit për ' + user.email + '.\n'
            };
            mailTransporter.sendMail(mailOptions, err => {
                res.json({
                    'status': 'ok',
                    'message': 'Fjalëkalimi i ri i juaj është rivendosur me sukses.'
                });
            });
        }
    ], err => {
        res.json({ "err": err })
    });
});
module.exports = router;