var router = require("express").Router();
var adminController = require('./admin');

//Admin Controller
router.use(adminController);

module.exports = router;