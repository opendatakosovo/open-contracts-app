const router = require("express").Router()
    , userValidation = require('../middlewares/user_validation');
const adminController = require('./admin');
const User = require('../models/user');
const config = require('../config/database');
const jwt = require("jsonwebtoken");

// Admin Controller
router.use(adminController);

// Login Route
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findUserByEmail(email, (err, user) => {
        if (err) {
            return res.json({ success: false, msg: 'Something went wrong!', error: err });
        }
        if (!user) {
            return res.json({ success: false, msg: 'Përdoruesi nuk u gjet!' });
        }
        if (user.isActive == false) {
            return res.json({ success: false, msg: 'Perdoruesi eshte joaktiv!' });
        }

        User.comparePassword(password, user.password, (err, isMached) => {
            if (err) {
                return res.json({ success: false, msg: 'Something went wrong!', error: err });
            }
            if (!isMached) {
                return res.json({ success: false, msg: 'Fjalëkalimi i gabuar!' });
            }

            const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 86400 });

            res.json({
                success: true,
                token: 'JWT ' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });
        });
    });
});

module.exports = router;