const router = require("express").Router();
const userRESTController = require("./user");
const directorateRESTController = require("./directorates");
const contractRESTController = require("./contracts");
const datasetRESTController = require('./datasets')

router.use('/user', userRESTController);
router.use('/directorates', directorateRESTController);
router.use('/contracts', contractRESTController);
router.use("/datasets", datasetRESTController);

module.exports = router;
