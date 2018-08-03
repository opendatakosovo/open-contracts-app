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
            return Contract.find({ "year": 2018 }).sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
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
            return Contract.find().sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
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

// Filtering contract based on all string fields
router.post('/filter', (req, res) => {
    let string = req.body.string;
    let directorate = req.body.directorate;
    let date = req.body.date;
    let referenceDate = req.body.referenceDate;
    let value = req.body.value;
    
    if ( (string !== 'Kërko kontratën' && string !== '') && (directorate == 'Drejtoria' || directorate === '') && date === null && (value === 'Vlera' || value === '')) {
        Contract.filterStringFieldsinContracts(req.body.string, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been retrived successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
        } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate !== 'Drejtoria' && directorate !== '') && date === null && (value === 'Vlera' || value ==='')) {
        Contract.findByStringAndDirectorate(string, directorate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate !== 'Drejtoria' && directorate !== '') && date !== null && (value === "Vlera" || value ==='')) {
        Contract.findbyStringDirectorateDate(string, directorate, date, referenceDate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate !== 'Drejtoria' && directorate !== '') && date !== null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyStringDirectorateDateValue(string, directorate, date, referenceDate, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been retrived successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate !== 'Drejtoria' && directorate !== '') && date === null && (value === 'Vlera' || value === '')) {
        Contract.findByDirectorate(directorate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been retrived successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    }else if ((string === 'Kërko kontratën' || string ==='') && (directorate === 'Drejtoria' || directorate ==='') && date !== null && (value === 'Vlera' || value === '')) {
        Contract.findByDate(date, referenceDate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate === 'Drejtoria' || directorate === '') && date === null && (value !== 'Vlera' && value !== '')) {
        Contract.findContractByValues(value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate === 'Drejtoria' || directorate === '') && date !== null && (value === 'Vlera' || value === '')) {
        Contract.findByStringDate(string, date, referenceDate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate === 'Drejtoria' || directorate === '') && date === null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyStringValue(string, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate !== 'Drejtoria' && directorate !== '') && date !== null && (value === 'Vlera' || value === '')) {
        Contract.findbyDirectorateDate(directorate, date, referenceDate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate !== 'Drejtoria' && directorate !== '') && date === null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyDirectorateValue(directorate, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate === 'Drejtoria' || directorate === '') && date !== null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyDateValue(date, referenceDate, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate !== 'Drejtoria' && directorate !== '') && date !== null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyDirectorateDateValue(directorate, date, referenceDate, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate === 'Drejtoria' || directorate === '') && date !== null && (value === 'Vlera' || value === '')) {
        Contract.findbyStringDate(string, date, referenceDate, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string !== 'Kërko kontratën' && string !== '') && (directorate !== 'Drejtoria' && directorate !== '') && date === null && (value !== 'Vlera' && value !== '')) {
        Contract.findbyStringDirectorateValue(string, directorate, value, (err, contracts) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
                    "contracts": contracts,
                    "success": true
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        });
    } else if ((string === 'Kërko kontratën' || string === '') && (directorate === 'Drejtoria' || directorate === '') && date === null && (value === 'Vlera' || value === '')) {
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
    }
});

module.exports = router;
