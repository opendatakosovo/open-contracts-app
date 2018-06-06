var router = require("express").Router();
var userRESTController = require("./user");


router.use('/user',userRESTController);

module.exports = router;
