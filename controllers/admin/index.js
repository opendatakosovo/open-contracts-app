const router = require("express").Router();
const userRESTController = require("./user");
const directorateRESTController = require("./directorates");
const contractRESTController = require("./contracts");


router.use('/user', userRESTController);
router.use('/directorates', directorateRESTController);
router.use('/contract', contractRESTController);


module.exports = router;
