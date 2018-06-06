const router = require("express").Router();
const adminController = require('./admin');

//Admin Controller
router.use(adminController);

module.exports = router;