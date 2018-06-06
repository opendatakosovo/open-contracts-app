let router = require("express").Router();
let userRESTController = require("./user");


router.use('/user', userRESTController);

module.exports = router;
