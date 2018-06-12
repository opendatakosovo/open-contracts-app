const router = require("express").Router();
const userRESTController = require("./user");

router.use('/user', userRESTController);

module.exports = router;
