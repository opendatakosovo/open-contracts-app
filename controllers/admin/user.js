const router = require("express").Router();
const User = require('../../models/user');

//Route for creating a user
router.post('/', (req, res) => {
    res.json({ "msg": "Create user" })
});

module.exports = router;