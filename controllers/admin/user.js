const router = require("express").Router();
const User = require('../../models/user');
const mailTransporter = require('../../utils/mail-transporter');
const passwordGenerator = require('../../utils/generate-password');
    
/*
 * ENDPOINTS PREFIX: /user
 */




// Route for creating a user
router.post('/', (req, res) => {
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

// Route for generate  password for a user
router.put('/generate-password/:id',(req, res) => {
    let password = passwordGenerator.generate();
    User.changePassword(req.params.id,password , (err, user) => {
        if(!err){
            console.log(user.email);
            const mail = {
                to: user.email,
                from: "support@prishtina.com",
                subject: "Ju është ndryshuar fjalëkalimi nga adminstruesi",
                html: `I/e nderuar
                        <br>
                        Adminstruesi e ka ndryshuar fjalëkalimin e juaj me sukses.<br>
                        Fjalekalimi i juaj është:<br>
                        <h3 style"color:green"><b>${password}</b></h3> 
                        <br>
                        Me nderime<br>
                        Ekipi menaxhues`
            }
            mailTransporter.sendMail(mail, err => {
                if(!err){
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

module.exports = router;