const router = require('express').Router();
const passport = require('passport');
const upload = require('../../utils/storage');
const Contract = require('../../models/contracts');
const contractValidation = require("../../middlewares/contract_validation");
const uploadFile = require('../../middlewares/upload_file');
const slugify = require('slugify');
const fs = require('fs');
/*
 * ENDPOINTS PREFIX: /contracts
 */

router.get("/", (req, res) => {
    Contract.getAllContracts((err, contracts) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "data": contracts,
                "success": true
            });
        }
    });
});

router.post("/latest-contracts/page", (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber
    };
    let response = {};
    Contract.countLatestContracts()
        .then(totalElements => {
            page.totalElements = totalElements;
            return page;
        })
        .then(page => {
            page.totalPages = Math.round(page.totalElements / page.size)
            return page;
        })
        .then(page => {
            page.skipPages = page.size * page.pageNumber
            return page;
        })
        .then(page => {
            return Contract.find({ "year": 2018 }).sort({ "contract.signingDate": -1 }).skip(page.skipPages).limit(page.size).then(result => {
                delete page.skipPages;
                response.page = page;
                response.data = result;
                return response;
            });
        })
        .then(response => {
            res.json(response)
        });
});

router.post("/page", (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber
    };
    let response = {};
    Contract.countContracts()
        .then(totalElements => {
            page.totalElements = totalElements;
            return page;
        })
        .then(page => {
            page.totalPages = Math.round(page.totalElements / page.size)
            return page;
        })
        .then(page => {
            page.skipPages = page.size * page.pageNumber
            return page;
        })
        .then(page => {
            return Contract.find().sort({ "contract.signingDate": -1 }).skip(page.skipPages).limit(page.size).then(result => {
                delete page.skipPages;
                response.page = page;
                response.data = result;
                return response;
            });
        })
        .then(response => {
            res.json(response)
        });
});

router.post("/", uploadFile, (req, res) => {
    if (req.fileExist) {
        res.json({
            "existErr": "File exsit",
            "success": false
        });
    } else if (req.typeValidation) {
        res.json({
            "typeValidation": "Document file type is wrong, you can only upload pdf file! ",
            "success": false
        });
    } else {
        const contentType = req.headers['content-type'];
        let requestedContract;
        let fileName;
        if (contentType.indexOf('application/json') == -1) {
            requestedContract = JSON.parse(req.body.contract);
            fileName = req.file.originalname;
        } else {
            requestedContract = req.body;
            fileName = "";
        }

        let contract = new Contract(requestedContract);
        contract.contract.file = fileName;
        contract.company.slug = slugify(requestedContract.company.name)
        contract.company.headquarters.slug = slugify(requestedContract.company.headquarters.name);
        Contract.addContract(contract, (err, contract) => {
            if (!err) {
                res.json({
                    "msg": "Contract has been added successfully",
                    "contract": contract,
                    "success": true
                });
            } else {
                res.json({
                    "msg": "test",
                    "err": err,
                    "success": false
                });
            }
        });
    }
});

router.get("/latest-contracts", (req, res) => {
    Contract.latestContracts((err, contract) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "contract": contract,
                "success": true,
            });
        }
    });
});

router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Contract.getContractById(req.params.id, (err, contract) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "data": contract,
                "success": true,
            });
        }
    });
});


// Route for deleting a contract by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Contract.deleteContractById(req.params.id, (err, contract) => {
        if (!err) {
            res.json({
                "msg": "Contract has been deleted successfully",
                "contract": contract,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Router for updating a contract by id
router.put('/update-contract/:id', passport.authenticate('jwt', { session: false }), uploadFile, (req, res) => {
    if (req.fileExist) {
        res.json({
            "existErr": "File exsit",
            "success": false
        });
    } else if (req.typeValidation) {
        res.json({
            "typeValidation": "Document file type is wrong, you can only upload pdf file! ",
            "success": false
        });
    } else {
        const contractId = req.params.id;
        let requestedContract;
        let fileName;
        const contentType = req.headers['content-type'];
        console.log(req.body.fileToDelete);
        if (req.body.fileToDelete != null) {
            fs.unlink(`./uploads/${req.body.fileToDelete}`, err => {
                if (err) {
                    res.json({
                        "errDel": err,
                        "success": false
                    });
                }
            });

        }
        if (contentType.indexOf('application/json') == -1) {
            requestedContract = JSON.parse(req.body.contract);
            requestedContract.contract.file = req.file.originalname;
        } else {
            requestedContract = req.body.contract;
            if (req.body.fileToDelete != null) {
                requestedContract.contract.file = "";
            }
        }
        Contract.updateContract(contractId, requestedContract, (err, contract) => {
            if (!err) {
                res.json({
                    "msg": "Contract has been updated successfully",
                    "contract": contract,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    }
});


module.exports = router;
