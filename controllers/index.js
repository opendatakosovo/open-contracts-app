let router = require("express").Router();
let adminController = require('./admin');

//Admin Controller
router.use(adminController);

module.exports = router;