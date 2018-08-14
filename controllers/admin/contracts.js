const router = require('express').Router();
const passport = require('passport');
const upload = require('../../utils/storage');
const Contract = require('../../models/contracts');
const contractValidation = require("../../middlewares/contract_validation");
const uploadFile = require('../../middlewares/upload_file');
const slugify = require('slugify');
const fs = require('fs');
const compareValues = require("../../utils/sortArrayByValues");
const authorize = require('../../middlewares/authorization');
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

// Sort latest contracts ascending
router.post("/latest-contracts/page/ascending", (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber,
        column: req.body.column
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
            Contract.find({ "year": { "$gte": 2018 } }).then(data => {
                const returnData = [];
                for (row of data) {
                    row = row.toObject();
                    row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                    row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                    row.companyName = row.company.name;
                    row.publicationDate = row.contract.publicationDate;
                    row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                    row.signingDate = row.contract.signingDate;
                    row.implementationDeadline = row.contract.implementationDeadline;
                    row.activityTitle1 = row.activityTitle.trim();
                    returnData.push(row);
                }
                returnData.sort(compareValues([page.column], 'asc'));
                if (page.skipPages === 0) {
                    returnData.splice(10, returnData.length)
                    delete page.skipPages;
                    response.page = page;
                    response.data = returnData;
                    res.json(response);
                } else {
                    returnData.splice(0, page.skipPages);
                    returnData.splice(10, returnData.length);
                    delete page.skipPages;
                    response.page = page;
                    response.data = returnData;
                    res.json(response);
                }
            }).catch(err => {
                res.json(err);
            });
        }).catch(err => {
            res.json(err);
        });
});

// Sort latest contracts descending
router.post("/latest-contracts/page/descending", (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber,
        column: req.body.column
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
        }).then(page => {
            Contract.find({ "year": new Date().getFullYear() }).then(data => {
                const returnData = [];
                for (row of data) {
                    row = row.toObject();
                    row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                    row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                    row.companyName = row.company.name;
                    row.publicationDate = row.contract.publicationDate;
                    row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                    row.signingDate = row.contract.signingDate;
                    row.implementationDeadline = row.contract.implementationDeadline;
                    row.activityTitle1 = row.activityTitle.trim();
                    returnData.push(row);
                }
                returnData.sort(compareValues([page.column], 'desc'));
                if (page.skipPages === 0) {
                    returnData.splice(10, returnData.length)
                    delete page.skipPages;
                    response.page = page;
                    response.data = returnData;
                    res.json(response);
                } else {
                    returnData.splice(0, page.skipPages);
                    returnData.splice(10, returnData.length);
                    delete page.skipPages;
                    response.page = page;
                    response.data = returnData;
                    res.json(response);
                }
            }).catch(err => {
                res.json(err);
            });
        }).catch(err => {
            res.json(err);
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
            return Contract.find({ "year": new Date().getFullYear() }).sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
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

// Sort contracts ascending
router.post("/page/ascending", passport.authenticate('jwt', { session: false }), authorize("superadmin", "admin", "user"), (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber,
        column: req.body.column
    };
    let response = {};
    Contract.countContracts(req.user.role, req.user.directorateName)
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
            if (req.user.role == "superadmin" || req.user.role == "admin") {
                Contract.find().then(data => {
                    const returnData = [];
                    for (row of data) {
                        row = row.toObject();
                        row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                        row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                        row.companyName = row.company.name;
                        row.publicationDate = row.contract.publicationDate;
                        row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                        row.signingDate = row.contract.signingDate;
                        row.implementationDeadline = row.contract.implementationDeadline;
                        row.activityTitle1 = row.activityTitle.trim();
                        returnData.push(row);
                    }
                    returnData.sort(compareValues([page.column], 'asc'));
                    if (page.skipPages === 0) {
                        returnData.splice(10, returnData.length)
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    } else {
                        returnData.splice(0, page.skipPages);
                        returnData.splice(10, returnData.length);
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    }
                }).catch(err => {
                    res.json(err);
                });
            } else {
                Contract.find({ "directorates": req.user.directorateName }).then(data => {
                    const returnData = [];
                    for (row of data) {
                        row = row.toObject();
                        row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                        row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                        row.companyName = row.company.name;
                        row.publicationDate = row.contract.publicationDate;
                        row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                        row.signingDate = row.contract.signingDate;
                        row.implementationDeadline = row.contract.implementationDeadline;
                        row.activityTitle1 = row.activityTitle.trim();
                        returnData.push(row);
                    }
                    returnData.sort(compareValues([page.column], 'asc'));
                    if (page.skipPages === 0) {
                        returnData.splice(10, returnData.length)
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    } else {
                        returnData.splice(0, page.skipPages);
                        returnData.splice(10, returnData.length);
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    }
                }).catch(err => {
                    res.json(err);
                });
            }
        }).catch(err => {
            res.json(err);
        });
});

// Sort contracts descending
router.post("/page/descending", passport.authenticate('jwt', { session: false }), authorize("superadmin", "admin", "user"), (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber,
        column: req.body.column
    };
    let response = {};
    Contract.countContracts(req.user.role, req.user.directorateName)
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
        }).then(page => {
            if (req.user.role == "superadmin" || req.user.role == "admin") {
                Contract.find().then(data => {
                    const returnData = [];
                    for (row of data) {
                        row = row.toObject();
                        row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                        row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                        row.companyName = row.company.name;
                        row.publicationDate = row.contract.publicationDate;
                        row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                        row.signingDate = row.contract.signingDate;
                        row.implementationDeadline = row.contract.implementationDeadline;
                        row.activityTitle1 = row.activityTitle.trim();
                        returnData.push(row);
                    }
                    returnData.sort(compareValues([page.column], 'desc'));
                    if (page.skipPages === 0) {
                        returnData.splice(10, returnData.length)
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    } else {
                        returnData.splice(0, page.skipPages);
                        returnData.splice(10, returnData.length);
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    }
                }).catch(err => {
                    res.json(err);
                });
            } else {
                Contract.find({ "directorates": req.user.directorateName }).then(data => {
                    const returnData = [];
                    for (row of data) {
                        row = row.toObject();
                        row.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                        row.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
                        row.companyName = row.company.name;
                        row.publicationDate = row.contract.publicationDate;
                        row.publicationDateOfGivenContract = row.contract.publicationDateOfGivenContract;
                        row.signingDate = row.contract.signingDate;
                        row.implementationDeadline = row.contract.implementationDeadline;
                        row.activityTitle1 = row.activityTitle.trim();
                        returnData.push(row);
                    }
                    returnData.sort(compareValues([page.column], 'desc'));
                    if (page.skipPages === 0) {
                        returnData.splice(10, returnData.length)
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    } else {
                        returnData.splice(0, page.skipPages);
                        returnData.splice(10, returnData.length);
                        delete page.skipPages;
                        response.page = page;
                        response.data = returnData;
                        res.json(response);
                    }
                }).catch(err => {
                    res.json(err);
                });
            }
        }).catch(err => {
            res.json(err);
        });
});

router.post("/page", passport.authenticate('jwt', { session: false }), authorize("superadmin", "admin", "user"), (req, res) => {
    let page = {
        size: req.body.size,
        totalElements: req.body.totalElements,
        totalPages: req.body.totalPages,
        pageNumber: req.body.pageNumber
    };
    let response = {};
    Contract.countContracts(req.user.role, req.user.directorateName)
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
            if (req.user.role == "admin" || req.user.role == "superadmin") {
                return Contract.find().sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            } else {
                return Contract.find({ 'directorates': req.user.directorateName }).sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }
        })
        .then(response => {
            res.json(response)
        });
});

router.post("/", passport.authenticate('jwt', { session: false }), authorize("superadmin", "admin"), uploadFile, (req, res) => {
    if (req.fileExist) {
        res.json({
            "existErr": "File exist",
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
        contract.activityTitleSlug = slugify(requestedContract.activityTitle);
        contract.contract.implementationDeadline = slugify(requestedContract.contract.implementationDeadline);
        contract.directorateSlug = slugify(requestedContract.directorates);
        contract.contract.predictedValueSlug = requestedContract.contract.predictedValue.replace(/[,]+/g, '');
        contract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.contract.totalAmountOfContractsIncludingTaxes.replace(/[,]+/g, '');
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
router.delete('/:id', passport.authenticate('jwt', { session: false }), authorize('superadmin', 'admin'), (req, res) => {
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
router.put('/update-contract/:id', passport.authenticate('jwt', { session: false }), authorize('superadmin', 'admin'), uploadFile, (req, res) => {
    if (req.fileExist) {
        res.json({
            "existErr": "File exist",
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
        if (req.body.fileToDelete != null && req.body.fileToDelete != 'undefined' && req.body.fileToDelete != undefined && req.body.fileToDelete != '') {
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
            console.log(requestedContract.activityTitle);
            requestedContract.contract.file = req.file.originalname;
            requestedContract.directoratesSlug = slugify(requestedContract.directorates);
            requestedContract.activityTitleSlug = slugify(requestedContract.activityTitle);
            requestedContract.contract.predictedValueSlug = requestedContract.contract.predictedValue.replace(/[,]+/g, '');
            requestedContract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.contract.totalAmountOfContractsIncludingTaxes.replace(/[,]+/g, '');
        } else {
            requestedContract = req.body.requestedContract;
            requestedContract.directoratesSlug = slugify(requestedContract.directorates);
            requestedContract.activityTitleSlug = slugify(requestedContract.activityTitle);
            requestedContract.contract.predictedValueSlug = requestedContract.contract.predictedValue.replace(/[,]+/g, '');
            requestedContract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.contract.totalAmountOfContractsIncludingTaxes.replace(/[,]+/g, '');
            if (requestedContract.contract.implementationDeadlineSlug !== null || requestedContract.contract.implementationDeadlineSlug !== '' || requestedContract.contract.implementationDeadlineSlug !== undefined) {
                requestedContract.contract.implementationDeadlineSlug = slugify(requestedContract.contract.implementationDeadline);
            }
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
    let page = {
        size: req.body.pageInfo.size,
        totalElements: req.body.pageInfo.totalElements,
        totalPages: req.body.pageInfo.totalPages,
        pageNumber: req.body.pageInfo.pageNumber
    };
    let response = {};
    let string = slugify(req.body.string);
    let directorate = req.body.directorate;
    let date = req.body.date;
    let referenceDate = req.body.referenceDate;
    let value = req.body.value;
    let year = req.body.year;
    let role;
    let directorateName;
    if (req.query.role != null) {
        role = req.query.role
    } else {
        role = null;
    }

    if (req.query.directorate != null) {
        directorateName = req.query.directorate;
    } else {
        directorateName = null;
    }

    if (string !== '' && directorate === '' & date === null && value === '') {
        Contract.filterStringFieldsInContractsCount(string, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterStringFieldsInContracts(string, year, role, directorateName).sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).
                    then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date === null && value === '') {
        Contract.filterByDirectorateCount(directorate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByDirectorate(directorate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date !== null && value === '') {
        Contract.filterByDateCount(date, referenceDate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByDate(date, referenceDate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date === null && value !== '') {
        Contract.filterByValueCount(value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByValue(value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date === null && value === '') {
        Contract.filterByStringAndDirectorateCount(string, directorate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringAndDirectorate(string, directorate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date !== null && value === '') {
        Contract.filterbyStringDirectorateDateCount(string, directorate, date, referenceDate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterbyStringDirectorateDate(string, directorate, date, referenceDate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date !== null && value !== '') {
        Contract.filterByStringDirectorateDateValueCount(string, directorate, date, referenceDate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringDirectorateDateValue(string, directorate, date, referenceDate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date !== null && value === '') {
        Contract.filterByStringDateCount(string, date, referenceDate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringDate(string, date, referenceDate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date === null && value !== '') {
        Contract.filterByStringValueCount(string, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringValue(string, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date !== null && value === '') {
        Contract.filterbyDirectorateDateCount(directorate, date, referenceDate, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterbyDirectorateDate(directorate, date, referenceDate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date === null && value !== '') {
        Contract.filterByDirectorateValueCount(directorate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByDirectorateValue(directorate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date !== null && value !== '') {
        Contract.filterByDateValueCount(date, referenceDate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByDateValue(date, referenceDate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date !== null && value !== '') {
        Contract.filterByDirectorateDateValueCount(directorate, date, referenceDate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByDirectorateDateValue(directorate, date, referenceDate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date === null && value !== '') {
        Contract.filterByStringDirectorateValueCount(string, directorate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringDirectorateValue(string, directorate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date !== null && value !== '') {
        Contract.filterByStringDateValueCount(string, date, referenceDate, value, year, role, directorateName)
            .then(totalElements => {
                totalElements.forEach(element => {
                    page.totalElements = element.total
                });
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
                return Contract.filterByStringDateValue(string, date, referenceDate, value, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date === null && value === '' && year !== 'any') {
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
                return Contract.find({ "year": { "$gte": 2018 } }).sort({ "createdAt": -1 }).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            })
            .then(response => {
                res.json(response)
            });
    } else {
        Contract.countContracts(role, directorateName)
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
    }
});



module.exports = router;
