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
                    row.totalAmountOfContractsIncludingTaxes = Number(row.releases[0].tender.value.amount.replace(/[^0-9\.-]+/g, ""));
                    row.predictedValue = Number(row.releases[0].planning.budget.amount.amount.replace(/[^0-9\.-]+/g, ""));
                    row.companyName = row.company.slug;
                    row.publicationDate = row.releases[0].tender.date;
                    row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                    row.signingDate = row.releases[0].contracts[0].period.startDate;
                    row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                    row.activityTitle1 = row.releases[0].tender.title.trim();
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
                    row.totalAmountOfContractsIncludingTaxes = Number(row.releases[0].tender.value.amount.replace(/[^0-9\.-]+/g, ""));
                    row.predictedValue = Number(row.releases[0].planning.budget.amount.amount.replace(/[^0-9\.-]+/g, ""));
                    row.companyName = row.company.slug;
                    row.publicationDate = row.releases[0].tender.date;
                    row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                    row.signingDate = row.releases[0].contracts[0].period.startDate;
                    row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                    row.activityTitle1 = row.releases[0].tender.title.trim();
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
                        row.totalAmountOfContractsIncludingTaxes = row.releases[0].tender.value.amount;
                        row.predictedValue = row.releases[0].planning.budget.amount.amount;
                        row.companyName = row.company.slug;
                        row.publicationDate = row.releases[0].tender.date;
                        row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                        row.signingDate = row.releases[0].contracts[0].period.startDate;
                        row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                        row.activityTitle1 = row.releases[0].tender.title.trim();
                        row.procurementNo = Number(row.releases[0].tender.id);
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
                        row.totalAmountOfContractsIncludingTaxes = row.releases[0].tender.value.amount;
                        row.predictedValue = row.releases[0].planning.budget.amount.amount;
                        row.companyName = row.company.slug;
                        row.publicationDate = row.releases[0].tender.date;
                        row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                        row.signingDate = row.releases[0].contracts[0].period.startDate;
                        row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                        row.activityTitle1 = row.releases[0].tender.title.trim();
                        row.procurementNo = Number(row.releases[0].tender.id);
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
                        row.totalAmountOfContractsIncludingTaxes = row.releases[0].tender.value.amount;
                        row.predictedValue = row.releases[0].planning.budget.amount.amount;
                        row.companyName = row.company.slug;
                        row.publicationDate = row.releases[0].tender.date;
                        row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                        row.signingDate = row.releases[0].contracts[0].period.startDate;
                        row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                        row.activityTitle1 = row.releases[0].tender.title.trim();
                        row.procurementNo = Number(row.releases[0].tender.id);
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
                        row.totalAmountOfContractsIncludingTaxes = row.releases[0].tender.value.amount;
                        row.predictedValue = row.releases[0].planning.budget.amount.amount;
                        row.companyName = row.company.slug;
                        row.publicationDate = row.releases[0].tender.date;
                        row.publicationDateOfGivenContract = row.releases[0].awards[0].date;
                        row.signingDate = row.releases[0].contracts[0].period.startDate;
                        row.implementationDeadline = row.releases[0].contracts[0].period.durationInDays;
                        row.activityTitle1 = row.releases[0].tender.title.trim();
                        row.procurementNo = Number(row.releases[0].tender.id);
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
        contract.releases[0].contracts[0].documents[0].title = fileName;
        contract.company.slug = slugify(requestedContract.releases[0].tender.tenderers.name);
        contract.company.headquarters.slug = slugify(requestedContract.releases[0].parties[0].address.region);
        contract.activityTitleSlug = slugify(requestedContract.releases[0].tender.title);
        contract.implementationDeadline = slugify(requestedContract.releases[0].contracts[0].period.durationInDays);
        contract.directorateSlug = slugify(requestedContract.releases[0].buyer.name);
        contract.contract.predictedValueSlug = requestedContract.releases[0].planning.budget.amount.amount.toString().replace(/[,]+/g, '');
        contract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.releases[0].tender.value.amount.toString().replace(/[,]+/g, '');
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

// Get contract by id and send as JSON file response
router.get('/json/:ocid', (req, res) => {
    Contract.getContractByOcidJson(req.params.ocid, (err, contract) => {
        if (contract.length !== 0) {
            let fileName = `${req.params.id}.json`;
            let mimeType = 'application/json';
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
            res.send(contract);
        } else {
            res.json({
                success: false,
                msg: "No contract with this id!"
            })
        }
    });
});

router.put('/update-all', (req, res) => {
    let updatedDataObject = {};
    Contract.getAllContracts((err, contracts) => {
        for (row of contracts) {
            if (row.bidOpeningDate === undefined) {
                row.bidOpeningDate = null;
            }
            if (row.contract.totalAmountOfContractsIncludingTaxes !== "" && row.contract.totalAmountOfContractsIncludingTaxes !== undefined && row.contract.totalAmountOfContractsIncludingTaxes !== null && row.contract.totalAmountOfContractsIncludingTaxes !== 'NaN') {
                row.contract.totalAmountOfContractsIncludingTaxes = Number(row.contract.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
            } else {
                row.contract.totalAmountOfContractsIncludingTaxes = 0;
            }
            if (row.contract.predictedValue !== "" && row.contract.predictedValue !== undefined && row.contract.predictedValue !== null && row.contract.predictedValue !== 'NaN') {
                row.contract.predictedValue = Number(row.contract.predictedValue.replace(/[^0-9\.-]+/g, ""));
            } else {
                row.contract.predictedValue = 0;
            }
            if (row.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== '' && row.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== undefined && row.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== null && row.contract.totalAmountOfAllAnnexContractsIncludingTaxes !== 'NaN') {
                row.contract.totalAmountOfAllAnnexContractsIncludingTaxes = Number(row.contract.totalAmountOfAllAnnexContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
            } else {
                row.contract.totalAmountOfAllAnnexContractsIncludingTaxes = 0;
            }
            if (row.contract.totalPayedPriceForContract !== '' && row.contract.totalPayedPriceForContract !== undefined && row.contract.totalPayedPriceForContract !== null && row.contract.totalPayedPriceForContract !== 'NaN') {
                row.contract.totalPayedPriceForContract = Number(row.contract.totalPayedPriceForContract.replace(/[^0-9\.-]+/g, ""));
            } else {
                row.contract.totalPayedPriceForContract = 0;
            }
            if (row.contract.discountAmountFromContract !== '' && row.contract.discountAmountFromContract !== undefined && row.contract.discountAmountFromContract !== null && row.contract.discountAmountFromContract !== 'NaN') {
                row.contract.discountAmountFromContract = Number(row.contract.discountAmountFromContract.replace(/[^0-9\.-]+/g, ""));
            } else {
                row.contract.discountAmountFromContract = 0;
            }
            transactionsArray = [];
            annexesArray = [];
            let transactions = () => {
                if (row.installments.length > 0) {
                    for (installment of row.installments) {
                        transactionsArray.push(
                            {
                                "id": Math.random().toString(36).substr(2, 9) + "-transaction",
                                "date": installment.installmentPayDate1,
                                "payer": {
                                    "id": buyerId,
                                    "name": row.directorates
                                },
                                "payee": {
                                    "id": payerId,
                                    "name": row.company.name
                                },
                                "value": {
                                    "amount": installment.installmentAmount1,
                                    "currency": "EUR"
                                }
                            }
                        )
                    }
                    transactionsArray.push(
                        {
                            "id": Math.random().toString(36).substr(2, 9) + "-last-transaction",
                            "date": row.lastInstallmentPayDate,
                            "payer": {
                                "id": buyerId,
                                "name": row.directorates
                            },
                            "payee": {
                                "id": payerId,
                                "name": row.company.name
                            },
                            "value": {
                                "amount": row.lastInstallmentAmount,
                                "currency": "EUR"
                            }
                        }
                    )
                    return transactionsArray;

                } else {
                    transactionsArray = [
                        {
                            "id": Math.random().toString(36).substr(2, 9) + "-last-transaction",
                            "date": row.lastInstallmentPayDate,
                            "payer": {
                                "id": buyerId,
                                "name": row.directorates
                            },
                            "payee": {
                                "id": payerId,
                                "name": row.company.name
                            },
                            "value": {
                                "amount": row.lastInstallmentAmount,
                                "currency": "EUR"
                            }
                        }
                    ]
                    return transactionsArray;
                }
            }
            let amendments = () => {
                if (row.contract.annexes.length > 0) {
                    for (annex of row.contract.annexes) {
                        annex.totalValueOfAnnexContract1 = Number(annex.totalValueOfAnnexContract1.replace(/[^0-9\.-]+/g, ""));
                        annexesArray.push(
                            {
                                "date": annex.annexContractSigningDate1,
                                "description": annex.totalValueOfAnnexContract1
                            }
                        )
                    }
                    return annexesArray;
                }
            }
            let ocid = '';
            let year;
            let ocidMaker = (value) => {
                if (row.year !== null && row.year !== undefined) {
                    let foo = '' + row.year
                    year = foo.slice(2, 4);
                } else {
                    year = 0;
                }
                ocid = 'ocds-3n5h6d-' + row.procurementNo + '-' + year + value;
                return ocid;
            }
            let method;
            let procurementMethod = () => {
                if (row.procurementProcedure === 'Procedura e hapur' || row.procurementProcedure === 'Procedura e negociuar pas publikimit të njoftimit të kontratës') {
                    method = 'open';
                } else if (row.procurementProcedure === 'Procedura e kufizuar' || row.procurementProcedure === 'Procedura e kuotimit të Çmimeve') {
                    method = 'limited';
                } else if (row.procurementProcedure === 'Procedura e negociuar pa publikim të njoftimit të kontratës') {
                    method = 'direct';
                } else if (row.procurementProcedure === 'Konkurs projektimi' || row.procurementProcedure === 'Procedura e vlerës minimale') {
                    method = 'selective';
                }
                return method;
            }
            let procurementMethodRationale = () => {
                if (row.procurementProcedure === 'Procedura e hapur') {
                    method = 'openProcedure';
                } else if (row.procurementProcedure === 'Procedura e negociuar pas publikimit të njoftimit të kontratës') {
                    method = 'negociatedProcedureAfterAwardNotice';
                } else if (row.procurementProcedure === 'Procedura e kufizuar') {
                    method = 'limitedProcedure';
                } else if (row.procurementProcedure === 'Procedura e negociuar pa publikim të njoftimit të kontratës') {
                    method = 'negociatedProcedureWithoutAwardNotice';
                } else if (row.procurementProcedure === 'Konkurs projektimi') {
                    method = 'designContest';
                } else if (row.procurementProcedure === 'Procedura e vlerës minimale') {
                    method = 'minimalValueProcedure';
                } else if (row.procurementProcedure === 'Procedura e kuotimit të Çmimeve') {
                    method = 'quotationValueProcedure';
                }
                return method;
            }
            let status;
            let contractStatus = () => {
                if (row.flagStatus === '1') {
                    status = 'pending';
                } else if (row.flagStatus === '2') {
                    status = 'active';
                } else if (row.flagStatus === '3') {
                    status = 'cancelled';
                }
                return status;
            }
            let complaint;
            let hasEnquiries = (enquiry) => {
                if (enquiry === 'complaintsToAuthority1') {
                    if (row.complaintsToAuthority1 === '1' || row.complaintsToAuthority1 === 'negativ') {
                        complaint = false;
                    } else if (row.complaintsToAuthority1 === '2' || row.complaintsToAuthority1 === 'pozitiv') {
                        complaint = true;
                    }
                } else if (enquiry === 'complaintsToOshp1') {
                    if (row.complaintsToOshp1 === '1' || row.complaintsToOshp1 === 'negativ') {
                        complaint = false;
                    } else if (row.complaintsToOshp1 === '2' || row.complaintsToOshp1 === 'pozitiv') {
                        complaint = true;
                    }
                } else if (enquiry === 'complaintsToAuthority2') {
                    if (row.complaintsToAuthority2 === '1' || row.complaintsToAuthority2 === 'negative') {
                        complaint = false;
                    } else if (row.complaintsToAuthority2 === '2' || row.complaintsToAuthority2 === 'pozitiv') {
                        complaint = true;
                    } else {
                        complaint = false;
                    }
                } else if (enquiry === 'type') {
                    if (row.complaintsToOshp2 === '1') {
                        complaint = 'negative';
                    } else if (row.complaintsToOshp2 === '2') {
                        complaint = 'positive';
                    } else {
                        complaint = 'none';
                    }
                } else if (enquiry === 'enquiryType') {
                    if (row.complaintsToAuthority2 === '1') {
                        complaint = 'negative';
                    } else if (row.complaintsToAuthority2 === '2') {
                        complaint = 'positive';
                    } else {
                        complaint = 'none';
                    }
                } else {
                    if (row.complaintsToOshp2 === '1' || row.complaintsToOshp2 === 'negativ') {
                        complaint = false;
                    } else if (row.complaintsToOshp2 === '2' || row.complaintsToOshp2 === 'pozitiv') {
                        complaint = true;
                    } else {
                        complaint = false;
                    }
                }
                return complaint;
            }
            let procurementType;
            let procurementCategory = (type) => {
                if (type === 'mainProcurementCategory') {
                    if (row.procurementType === 'Furnizim') {
                        procurementType = 'goods';
                    } else if (row.procurementType === 'Punë' || row.procurementType === 'Punë me koncesion' || row.procurementType === 'Konkurs projektimi' || row.procurementType === 'Pronë e palujtshme') {
                        procurementType = 'works';
                    } else if (row.procurementType === 'Shërbime' || row.procurementType === 'Shërbime këshillimi') {
                        procurementType = 'services';
                    }
                } else if (type === 'additionalProcurementCategories') {
                    if (row.procurementType === 'Furnizim') {
                        procurementType = 'goods';
                    } else if (row.procurementType === 'Punë') {
                        procurementType = 'works';
                    } else if (row.procurementType === 'Shërbime') {
                        procurementType = 'services';
                    } else if (row.procurementType === 'Shërbime këshillimi') {
                        procurementType = 'consultingServices';
                    } else if (row.procurementType === 'Punë me koncesion') {
                        procurementType = 'concessionWorks';
                    } else if (row.procurementType === 'Konkurs projektimi') {
                        procurementType = 'designContest';
                    } else if (row.procurementType === 'Pronë e palujtshme') {
                        procurementType = 'immovableProperty';
                    }
                }
                return procurementType;
            }
            let criteria;
            let awardCriteria = () => {
                if (row.contract.criteria === 'Çmimi më i ulët') {
                    criteria = 'priceOnly';
                } else if (row.contract.criteria === 'Tenderi ekonomikisht më i favorshëm') {
                    criteria = 'costOnly';
                } else if (row.contract.criteria === 'Çmimi më i ulët me poentim') {
                    criteria = 'ratedCriteria';
                }
                return criteria;
            }
            let planned = [];
            let plannedDocument = () => {
                if (row.planned === '1' || row.planned === 'po') {
                    planned.push({
                        'id': Math.random().toString(36).substr(2, 9) + '-procurementPlan',
                        'documentType': 'procurementPlan'
                    });
                }
                return planned;
            }
            let process = [];
            let relatedProcesses = () => {
                if (row.retender === 'po' || row.tender === 'Po') {
                    process.push({
                        "relationship": "unsuccessfulProcess"
                    });
                }
                return process;
            }
            let procurementValue;
            let estimatedValue = () => {
                if (row.procurementValue === 'Vlerë e madhe') {
                    procurementValue = "bigValue";
                } else if (row.procurementValue === 'Vlerë e mesme') {
                    procurementValue = 'mediumValue';
                } else if (row.procurementValue === 'Vlerë e vogël') {
                    procurementValue = 'smallValue';
                } else if (row.procurementValue === 'Vlerë minimale') {
                    procurementValue = 'minimalValue';
                }
                return procurementValue;
            }
            let procedure;
            let acceleratedProcedure = () => {
                if (row.applicationDeadlineType === '1' || row.applicationDeadlineType === 'Afati kohor normal') {
                    procedure = true;
                } else if (row.applicationDeadlineType === '2' || row.applicationDeadlineType === 'Afati kohor i shkurtuar') {
                    procedure = false;
                }
                return procedure;
            }
            let buyerId = Math.random().toString(36).substr(2, 9) + '-payer';
            let payerId = Math.random().toString(36).substr(2, 9) + '-payee';
            let milestonesId;
            let milestoneId = (code) => {
                milestonesId = Math.random().toString(36).substr(2, 9) + '-' + code;
                return milestonesId;
            }
            let itemsId = Math.random().toString(36).substr(2, 9) + '-CPV' + '-' + row.fppClassification;
            let documentsId;
            let documentId = (type) => {
                documentsId = Math.random().toString(36).substr(2, 9) + '-' + type;
                return documentsId;
            }
            let documents = [];
            let contractDocument = () => {
                if (row.contract.file) {
                    documents.push({
                        "id": documentId('contractSigned'),
                        "documentType": "contractSigned",
                        "title": row.contract.file,
                        "url": `https://kontratatehapura.prishtinaonline.com/uploads/${row.contract.file}`,
                        "format": "application/pdf",
                        "language": "sq"
                    })
                }
                return documents;
            }
            let tenderDocuments = () => {
                if (row.contract.documents.length > 0) {
                    for (document of row.contract.documents) {
                        documents.push({
                            "id": documentId('tenderNotice'),
                            "documentType": "tenderNotice",
                            "title": document,
                            "url": `https://kontratatehapura.prishtinaonline.com/documents/${document}`,
                            "format": "application/pdf",
                            "language": "sq"
                        })
                    }
                }
                return documents;
            }
            let tenderStatus;
            let tendersStatus = () => {
                if (row.status === '1' || row.status === 'publikuar') {
                    tenderStatus = 'active';
                } else if ((row.status === '2' || row.status === 'vlerësim') && row.startingOfEvaluationDate && row.endingOfEvaluationDate) {
                    tenderStatus = 'active';
                } else if (row.status === '3' || row.status === 'anuluar') {
                    tenderStatus = 'cancelled';
                } else if (row.status === '4' || row.status === 'kontraktuar') {
                    tenderStatus = "complete";
                } else {
                    tenderStatus = row.status;
                }
                return tenderStatus;
            }
            let local;
            let partyDetails = () => {
                if (row.company.type === 'Vendore' || row.company.type === 'vendor' || row.company.type === 'OE Vendor' || row.company.type === '1') {
                    local = true;
                } else if (row.company.type === 'notLocal' || row.company.type === 'jo vendor' || row.company.type === 'jovendor') {
                    local = false;
                }
                return local;
            }
            updatedDataObject = {
                "uri": `https://kontratatehapura.prishtinaonline.com/contracts/json/${ocidMaker("")}`,
                "version": "1.1",
                "publishedDate": row.createdAt,
                "extensions": [
                    "https://raw.githubusercontent.com/open-contracting/ocds_bid_extension/v1.1.3/extension.json",
                    "https://raw.githubusercontent.com/leobaz/ocds_estimatedSizeOfProcurementValue_extension/master/extension.json",
                    "https://raw.githubusercontent.com/leobaz/ocds_isAcceleratedProcedure_extension/master/extension.json",
                    "https://raw.githubusercontent.com/leobaz/ocds_expectedNumberOfTransactions_extension/master/extension.json",
                    "https://raw.githubusercontent.com/open-contracting-extensions/ocds_contract_completion_extension/master/extension.json",
                    "https://raw.githubusercontent.com/leobaz/ocds_deductionAmountFromContract_extension/master/extension.json"
                ],
                "releases": [
                    {
                        "language": "sq",
                        "date": row.createdAt,
                        "id": ocidMaker("-contract"),
                        "initiationType": "tender",
                        "ocid": ocidMaker(""),
                        "tag": [
                            "contract"
                        ],
                        "relatedProcesses": relatedProcesses(),
                        "parties": [
                            {
                                "identifier": {
                                    "legalName": 'Komuna e Prishtinës'
                                },
                                "name": row.directorates,
                                "address": {
                                    "region": "Prishtinë",
                                    "postalCode": "10000",
                                    "countryName": "Kosovë"
                                },
                                "contactPoint": {
                                    "name": row.nameOfProcurementOffical,
                                    "url": "https://kk.rks-gov.net/prishtine/"
                                },
                                "roles": [
                                    "buyer",
                                    "payer",
                                    "procuringEntity"
                                ],
                                "id": buyerId
                            },
                            {
                                "name": row.company.name,
                                "address": {
                                    "region": row.company.headquarters.name
                                },
                                "roles": [
                                    "supplier",
                                    "tenderer",
                                    "payee"
                                ],
                                "id": payerId,
                                "details": {
                                    "local": partyDetails()
                                }
                            }
                        ],
                        "buyer": {
                            "id": buyerId,
                            "name": row.directorates
                        },
                        "planning": {
                            "budget": {
                                "id": ocidMaker("-planning"),
                                "description": row.budget,
                                "amount": {
                                    "amount": row.contract.predictedValue,
                                    "currency": "EUR"
                                }
                            },
                            "documents": plannedDocument(),
                            "milestones": [
                                {
                                    "id": milestoneId('initiationDate'),
                                    "title": "Data e inicimit të aktivitetit të prokurimit (data e pranimit të kërkesës)",
                                    "type": "preProcurement",
                                    "code": "initiationDate",
                                    "dateMet": row.initiationDate,
                                    "status": "met"
                                },
                                {
                                    "id": milestoneId('approvalDateOfFunds'),
                                    "title": "Data e aprovimit të deklaratës së nevojave dhe disponueshmërisë së mjeteve",
                                    "type": "approval",
                                    "code": "approvalDateOfFunds",
                                    "dateMet": row.approvalDateOfFunds,
                                    "status": "met"
                                },
                                {
                                    "id": milestoneId('torDate'),
                                    "title": "Data e pranimit të specifikimit teknik (TOR)",
                                    "type": "assessment",
                                    "code": "torDate",
                                    "dateMet": row.torDate,
                                    "status": "met"
                                },
                                {
                                    "id": milestoneId('reapprovalDate'),
                                    "title": "Data e aprovimit të Deklaratës së nevojave dhe disponueshmërisë së mjeteve - rikonfirmimi",
                                    "type": "approval",
                                    "code": "reapprovalDate",
                                    "dateMet": row.reapprovalDate,
                                    "status": "met"
                                }
                            ]
                        },
                        "tender": {
                            "id": row.procurementNo,
                            "title": row.activityTitle,
                            "date": row.contract.publicationDate,
                            "status": tendersStatus(),
                            "items": [
                                {
                                    "id": itemsId,
                                    "description": "The CPV number for the services provided",
                                    "classification": {
                                        "scheme": "CPV",
                                        "id": "CPV",
                                        "description": "The common procurement vocabulary number"
                                    },
                                    "quantity": row.fppClassification
                                }
                            ],
                            "numberOfTenderers": row.noOfCompaniesWhoSubmited,
                            "tenderers": {
                                "name": row.company.name,
                                "id": payerId
                            },
                            "value": {
                                "amount": row.contract.totalAmountOfContractsIncludingTaxes,
                                "currency": "EUR"
                            },
                            "procurementMethod": procurementMethod(),
                            "procurementMethodRationale": procurementMethodRationale(),
                            "mainProcurementCategory": procurementCategory('mainProcurementCategory'),
                            "additionalProcurementCategories": procurementCategory('additionalProcurementCategories'),
                            "hasEnquiries": hasEnquiries('complaintsToAuthority1'),
                            "hasComplaints": hasEnquiries('complaintsToOshp1'),
                            "tenderPeriod": {
                                "startDate": row.bidOpeningDate
                            },
                            "awardPeriod": {
                                "startDate": row.startingOfEvaluationDate,
                                "endDate": row.endingOfEvaluationDate,
                                "durationInDays": row.startingAndEndingEvaluationDate
                            },
                            "contractPeriod": {
                                "startDate": row.contract.signingDate,
                                "endDate": row.contract.closingDate,
                                "durationInDays": row.contract.implementationDeadline
                            },
                            "awardCriteria": awardCriteria(),
                            "procuringEntity": {
                                "id": buyerId,
                                "name": row.directorates
                            },
                            "documents": tenderDocuments(),
                            "milestones": [
                                {
                                    "id": milestoneId('standardDocuments'),
                                    "title": "Letrat Standarde për OE",
                                    "type": "engagement",
                                    "code": "standardDocuments",
                                    "dateMet": row.company.standardDocuments,
                                    "status": "met"
                                },
                                {
                                    "id": milestoneId('cancellationNoticeDate'),
                                    "title": "Data e publikimit të anulimit të njoftimit",
                                    "type": "approval",
                                    "code": "cancellationNoticeDate",
                                    "dateMet": row.cancellationNoticeDate,
                                    "status": "met"
                                }
                            ],
                            "estimatedSizeOfProcurementValue": {
                                "estimatedValue": estimatedValue()
                            },
                            "procedure": {
                                "isAcceleratedProcedure": acceleratedProcedure()
                            }
                        },
                        "awards": [
                            {
                                "id": ocidMaker("-award"),
                                "date": row.contract.publicationDateOfGivenContract,
                                "suppliers": [{
                                    "id": payerId,
                                    "name": row.company.name
                                }],
                                "contractPeriod": {
                                    "startDate": row.contract.signingDate,
                                    "endDate": row.contract.closingDate,
                                    "durationInDays": row.contract.implementationDeadline
                                },
                                "hasEnquiries": hasEnquiries('complaintsToAuthority2'),
                                "hasComplaints": hasEnquiries('complaintsToOshp2'),
                                "complaintType": hasEnquiries('type'),
                                "enquiryType": hasEnquiries('enquiryType')
                            }
                        ],
                        "contracts": [
                            {
                                "id": ocidMaker("-contract"),
                                "awardID": ocidMaker("-award"),
                                "status": contractStatus(),
                                "period": {
                                    "startDate": row.contract.signingDate,
                                    "endDate": row.contract.closingDate,
                                    "durationInDays": row.contract.implementationDeadline
                                },
                                "value": {
                                    "amount": row.contract.totalAmountOfAllAnnexContractsIncludingTaxes,
                                    "currency": "EUR"
                                },
                                "dateSigned": row.contract.signingDate,
                                "documents": contractDocument(),
                                "implementation": {
                                    "transactions": transactions(),
                                    "finalValue": {
                                        "amount": row.contract.totalPayedPriceForContract,
                                        "currency": "EUR"
                                    },
                                    "finalValueDetails": "The total amount of the contract payed"
                                },
                                "amendments": amendments(),
                                "expectedNumberOfTransactions": row.noOfPaymentInstallments,
                                "deductionAmountFromContract": {
                                    "value": {
                                        "amount": row.contract.discountAmountFromContract,
                                        "currency": "EUR"
                                    }
                                }
                            }
                        ],
                        "bids": {
                            "statistics": [
                                {
                                    "id": "0001",
                                    "measure": "numberOfDownloads",
                                    "value": row.noOfCompaniesWhoDownloadedTenderDoc,
                                    "notes": "Nr. i OE që kanë shkarkuar dosjen e tenderit"
                                },
                                {
                                    "id": "0002",
                                    "measure": "numberOfRefusedBids",
                                    "value": row.noOfRefusedBids,
                                    "notes": "Numri i ofertave të refuzuara"
                                }
                            ]
                        }
                    }
                ],
                "publisher": {
                    "name": "Open Data Kosovo",
                    "uid": "5200316-4",
                    "uri": "http://opendatakosovo.org"
                },
                "activityTitleSlug": row.activityTitleSlug,
                "company": {
                    "slug": row.company.slug,
                    "headquarters": {
                        "slug": row.company.headquarters.slug
                    }
                },
                "directoratesSlug": row.directorateSlug,
                "contract": {
                    "predictedValueSlug": row.contract.predictedValueSlug,
                    "totalAmountOfContractsIncludingTaxesSlug": row.contract.totalAmountOfContractsIncludingTaxesSlug,
                    "implementationDeadlineSlug": row.contract.implementationDeadlineSlug,
                    "discountAmountFromContract": row.contract.discountAmountFromContract
                },
                "year": row.year
            }
            let updatedContract = new Contract(updatedDataObject);
            Contract.addContract(updatedContract, (err, contract) => {
                if (err) {
                    res.json(err);
                }
            });
            Contract.deleteContractById(row._id, (err, contract) => {
                if (err) {
                    res.json(err);
                }
            })

        }
        if (!err) {
            res.json({
                "msg": "Contracts has been updated successfully",
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }

    });

})

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
            requestedContract.releases[0].contracts[0].documents[0].title = req.file.originalname;
            requestedContract.directoratesSlug = slugify(requestedContract.releases[0].buyer.name);
            requestedContract.activityTitleSlug = slugify(requestedContract.releases[0].tender.title);
            requestedContract.contract.predictedValueSlug = requestedContract.releases[0].planning.budget.amount.amount.toString().replace(/[,]+/g, '');
            requestedContract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.releases[0].tender.value.amount.toString().replace(/[,]+/g, '');
            requestedContract.company.slug = slugify(requestedContract.releases[0].tender.tenderers.name);
            requestedContract.company.headquarters.slug = slugify(requestedContract.releases[0].parties[0].address.region);
        } else {
            requestedContract = req.body.requestedContract;
            requestedContract.directoratesSlug = slugify(requestedContract.releases[0].buyer.name);
            requestedContract.activityTitleSlug = slugify(requestedContract.releases[0].tender.title);
            requestedContract.contract.predictedValueSlug = requestedContract.releases[0].planning.budget.amount.amount.toString().replace(/[,]+/g, '');
            requestedContract.contract.totalAmountOfContractsIncludingTaxesSlug = requestedContract.releases[0].tender.value.amount.toString().replace(/[,]+/g, '');
            requestedContract.company.slug = slugify(requestedContract.releases[0].tender.tenderers.name);
            requestedContract.company.headquarters.slug = slugify(requestedContract.releases[0].parties[0].address.region);
            if (requestedContract.implementationDeadlineSlug !== null || requestedContract.implementationDeadlineSlug !== '' || requestedContract.implementationDeadlineSlug !== undefined) {
                requestedContract.implementationDeadlineSlug = slugify(requestedContract.releases[0].contracts[0].period.durationInDays);
            }
            if (req.body.fileToDelete != null) {
                requestedContract.releases[0].contracts[0].documents[0].title = "";
            }
        }
        Contract.updateContract(contractId, requestedContract, (err, contract) => {
            if (!err) {
                res.json({
                    "msg": "Contracts has been updated successfully",
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
    if (req.body.year !== 'any') {
        year = parseInt(year);
    }
    let procurementNo = req.body.procurementNo;
    if (procurementNo !== '') {
        procurementNo = parseInt(procurementNo);
    }
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
    if (string !== '' && directorate === '' & date === null && value === '' && procurementNo === '') {
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
    } else if (string === '' && directorate !== '' & date === null && value === '' && procurementNo === '') {
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
    } else if (string === '' && directorate === '' & date !== null && value === '' && procurementNo === '') {
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
    } else if (string === '' && directorate === '' & date === null && value !== '' && procurementNo === '') {
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
    } else if (string !== '' && directorate !== '' & date === null && value === '' && procurementNo === '') {
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
    } else if (string !== '' && directorate !== '' & date !== null && value === '' && procurementNo === '') {
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
    } else if (string !== '' && directorate !== '' & date !== null && value !== '' && procurementNo === '') {
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
    } else if (string !== '' && directorate === '' & date !== null && value === '' && procurementNo === '') {
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
    } else if (string !== '' && directorate === '' & date === null && value !== '' && procurementNo === '') {
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
    } else if (string === '' && directorate !== '' & date !== null && value === '' && procurementNo === '') {
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
    } else if (string === '' && directorate !== '' & date === null && value !== '' && procurementNo === '') {
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
    } else if (string === '' && directorate === '' & date !== null && value !== '' && procurementNo === '') {
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
    } else if (string === '' && directorate !== '' & date !== null && value !== '' && procurementNo === '') {
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
    } else if (string !== '' && directorate !== '' & date === null && value !== '' && procurementNo === '') {
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
    } else if (string !== '' && directorate === '' & date !== null && value !== '' && procurementNo === '') {
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
    } else if (string === '' && directorate === '' && date === null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoCount(procurementNo, year, role, directorateName)
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
                return Contract.filterByProcurementNo(procurementNo, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' && date === null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoStringCount(procurementNo, string, year, role, directorateName)
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
                return Contract.filterByProcurementNoString(procurementNo, string, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date === null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoDirectorateCount(procurementNo, directorate, year, role, directorateName)
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
                return Contract.filterByProcurementNoDirectorate(procurementNo, directorate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date === null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoDirectorateStringCount(procurementNo, string, directorate, year, role, directorateName)
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
                return Contract.filterByProcurementNoDirectorateString(procurementNo, string, directorate, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date === null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoValueCount(procurementNo, value, year, role, directorateName)
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
                return Contract.filterByProcurementNoValue(procurementNo, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date === null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoValueStringCount(procurementNo, string, value, year, role, directorateName)
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
                return Contract.filterByProcurementNoValueString(procurementNo, string, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date === null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoDirectorateValueCount(procurementNo, directorate, value, year, role, directorateName)
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
                return Contract.filterByProcurementNoDirectorateValue(procurementNo, directorate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date === null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoStringDirectorateValueCount(procurementNo, string, directorate, value, year, role, directorateName)
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
                return Contract.filterByProcurementNoStringDirectorateValue(procurementNo, string, directorate, value, year, role, directorateName).skip(page.skipPages).
                    limit(page.size).then(result => {
                        delete page.skipPages;
                        response.page = page;
                        response.data = result;
                        return response;
                    });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date !== null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoDateCount(procurementNo, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoDate(procurementNo, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date !== null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoStringDateCount(procurementNo, string, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoStringDate(procurementNo, string, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date !== null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoDirectorateDateCount(procurementNo, directorate, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoDirectorateDate(procurementNo, directorate, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date !== null && value === '' && procurementNo !== '') {
        Contract.filterByProcurementNoStringDirectorateDateCount(procurementNo, string, directorate, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoStringDirectorateDate(procurementNo, string, directorate, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date !== null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoDateValueCount(procurementNo, value, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoDateValue(procurementNo, value, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate === '' & date !== null && value !== '' && procurementNo !== '') {
        Contract.filterByProcurementNoStringDateValueCount(procurementNo, string, value, date, referenceDate, year, role, directorateName)
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
                return Contract.filterByProcurementNoStringDateValue(procurementNo, string, value, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate !== '' & date !== null && value !== '' && procurementNo !== '') {
        Contract.filterbyProcurementNoDirectorateValueDateCount(procurementNo, directorate, value, date, referenceDate, year, role, directorateName)
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
                return Contract.filterbyProcurementNoDirectorateValueDate(procurementNo, directorate, value, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string !== '' && directorate !== '' & date !== null && value !== '' && procurementNo !== '') {
        Contract.filterbyProcurementNoStringDirectorateValueDateCount(procurementNo, string, directorate, value, date, referenceDate, year, role, directorateName)
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
                return Contract.filterbyProcurementNoStringDirectorateValueDate(procurementNo, string, directorate, value, date, referenceDate, year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    } else if (string === '' && directorate === '' & date === null && value === '' && year === 2018 && procurementNo === '') {
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
    } else if (string === '' && directorate === '' & date === null && value === '' && year === 'any' && procurementNo === '') {
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
    } else {
        console.log(year);
        Contract.filterContractsbyYearCount(year, role, directorateName)
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
                return Contract.filterContractsbyYear(year, role, directorateName).skip(page.skipPages).limit(page.size).then(result => {
                    delete page.skipPages;
                    response.page = page;
                    response.data = result;
                    return response;
                });
            }).then(response => {
                res.json(response);
            })
    }
});



///////////////////////////////////////////////////////////
////////////////// Upload documents ///////////////////////
///////////////////////////////////////////////////////////

const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, './documents')
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`)
    }
})

const upload1 = multer({ storage: storage }).array('file', 10);

router.post('/upload/documents', (req, res) => {
    upload1(req, res, function (err) {
        if (err) {
            return res.end("Failed");
        }
        res.end("Completed");
    });
});

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
/////////////// Delete documents ///////////////////
///////////////////////////////////////////////////////////
router.post('/delete/documents', (req, res) => {
    if (req.body.length > 0) {
        const docsToDeleteArr = req.body;
        docsToDeleteArr.forEach(doc => fs.unlink(`./documents/${doc}`, err => {
            if (err) {
                return;
            }
        }));
    }
    res.end("Completed");
});





module.exports = router;
