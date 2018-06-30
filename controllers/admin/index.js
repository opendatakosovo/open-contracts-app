const router = require("express").Router();
const userRESTController = require("./user");
const directorateRESTController = require("./directorates");
const contractRESTController = require("./contracts");

router.use('/user', userRESTController);
router.use('/directorates', directorateRESTController);
router.use('/contracts', contractRESTController);

module.exports = router;
