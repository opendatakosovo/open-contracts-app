const router = require("express").Router();
const userRESTController = require("./user");
const userRESTControllerDirectorate = require("./directorates");


router.use('/user', userRESTController);
router.use('/directorates' , userRESTControllerDirectorate);


module.exports = router;
