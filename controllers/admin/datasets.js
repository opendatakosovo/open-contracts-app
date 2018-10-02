const router = require('express').Router();
const Dataset = require('../../models/datasets');
const upload = require("../../utils/datasetStorage");
const reupload = require("../../utils/updateDatasetStorage");
const Contract = require('../../models/contracts');
const passport = require('passport');
const shell = require('shelljs');
const fs = require('fs');
const authorize = require('../../middlewares/authorization');
const csv = require('fast-csv');
const moment = require('moment');

router.get("/", (req, res) => {
    Dataset.getAllDatasets((err, datasets) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "datasets": datasets,
                "success": true
            });
        }
    });
});

router.post("/", passport.authenticate('jwt', { session: false }), authorize('superadmin', 'admin'), upload.single('datasetFile'), (req, res) => {
    if (req.typeValidation) {
        res.json({
            "typeValidation": "Dataset type is wrong",
            "success": false
        });
    } else if (req.nameValidation) {
        res.json({
            "nameValidation": "Dataset is old or dataset name is invalid",
            "success": false
        });
    } else {
        if (req.fileExist) {
            const dataset = {
                datasetFilePath: req.file.originalname,
                folder: "new"
            };
            Contract.deleteContractsByYear(dataset.datasetFilePath.split('.')[0])
                .then(() => {
                    importCsv(dataset.datasetFilePath, (error, stdout, stderr) => {
                        if (!error) {
                            Dataset.updateByFilePath(dataset.datasetFilePath, dataset).then(upatedDataset => {
                                res.json({
                                    "msg": "Dataset has been reimported successfully",
                                    "dataset": upatedDataset,
                                    "success": true,
                                    "reImported": true
                                });
                                fs.unlinkSync(`./prishtina-contracts-importer/data/procurements/new/${dataset.datasetFilePath.split('.')[0]}-backup.${dataset.datasetFilePath.split('.')[1]}`);
                            }).catch(err => {
                                res.json({
                                    "err": err,
                                    "success": false
                                });
                            });
                        } else {
                            importBackup(dataset.datasetFilePath, err => {
                                if (!err) {
                                    importCsv(dataset.datasetFilePath, (error, stdout, stdErrBackup) => {
                                        if (!error) {
                                            res.json({
                                                "shelljsErr": stderr,
                                                "success": false
                                            });
                                        } else {
                                            res.json({
                                                "shelljsErrBackup": stdErrBackup,
                                                "success": false
                                            });
                                        }
                                    })
                                } else {
                                    res.json({
                                        "backUpErr": err,
                                        "success": false
                                    });
                                }
                            });
                        }
                    })
                })
                .catch(err => {
                    res.json({
                        "err": err,
                        "success": false
                    });
                });

        } else {
            const dataset = new Dataset({
                datasetFilePath: req.file.originalname,
                folder: "new"
            });
            importCsv(dataset.datasetFilePath, (error, stdout, stderr) => {
                if (!error) {
                    Dataset.addDataset(dataset)
                        .then(dataset => {
                            res.json({
                                "msg": "Dataset has been imported successfully",
                                "dataset": dataset,
                                "success": true,
                                "reImported": false
                            });
                        })
                        .catch(err => {
                            res.json({
                                "err": err,
                                "success": false
                            });
                        })

                } else {
                    res.json({
                        "shelljsErr": stderr,
                        "success": false
                    });
                    fs.unlinkSync(`./prishtina-contracts-importer/data/procurements/new/${dataset.datasetFilePath}`);
                }
            });
        }
    }

});

router.get("/:name", (req, res) => {
    Dataset.getByName(req.params.name, (err, dataset) => {
        if (!err) {
            if (dataset != null) {
                res.json({
                    "msg": "Dataset has been retrived successfully",
                    "dataset": dataset,
                    "success": true
                });
            } else {
                res.json({
                    "msg": "Dataset has not been found",
                    "dataset": null,
                    "success": false
                });
            }
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    })
});

function importCsv(csv, cb) {
    shell.cd("prishtina-contracts-importer");
    shell.exec(`bash run-with-args.sh ${csv}`, { async: true }, cb);
    shell.cd("..");
};

function importBackup(csv, cb) {
    const filename = {
        name: csv.split('.')[0],
        type: csv.split('.')[1]
    };
    fs.unlinkSync(`./prishtina-contracts-importer/data/procurements/new/${csv}`);
    fs.rename(`./prishtina-contracts-importer/data/procurements/new/${filename.name}-backup.${filename.type}`, `./prishtina-contracts-importer/data/procurements/new/${csv}`, cb);
}

// Get all contracts by years and send as JSON file response
router.get('/json/:year', (req, res) => {
    Contract.getContractsByYears(req.params.year)
        .then(data => {
            if (data.length !== 0) {
                let fileName = `${req.params.year}.json`;
                let mimeType = 'application/json';
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
                res.send(data);
            } else {
                res.json({
                    success: false,
                    msg: "No contracts for this year!"
                })
            };
        }).catch(err => {
            res.json(err);
        });
});

router.put('/update', passport.authenticate('jwt', { session: false }), authorize('superadmin', 'admin'), reupload.single('datasetFile'), (req, res) => {
    if (req.typeValidation) {
        res.json({
            "typeValidation": "Dataset type is wrong",
            "success": false
        });
    } else if (req.nameValidation) {
        res.json({
            "nameValidation": "Dataset is old or dataset name is invalid",
            "success": false
        });
    } else if (req.fileDoesntExist) {
        res.json({
            "fileDoesntExist": "Dataset cannot updated because doesn't exist",
            "success": false
        });
    } else {
        const dataset = {
            datasetFilePath: req.file.originalname,
            folder: "new"
        };
        Dataset.updateByFilePath(dataset.datasetFilePath, dataset)
            .then(data => {
                res.json({
                    "msg": "Dataset has been updated successfully",
                    "dataset": data,
                    "success": true,
                });
            })
            .catch(err => {
                console.log(err);
                res.json({
                    "err": err,
                    "success": false
                });
            })
    }

});

router.put('/update-csv/:year', (req, res) => {
    year = req.params.year;
    if (year === '2010' || year === '2011' || year === '2012' || year === '2013' || year === '2014' || year === '2015' || year === '2016') {
        folder = 'old';
    } else {
        folder = 'new';
    }
    let formatDate = (date) => {
        if (typeof date === 'object') {
            if (date !== null && date !== undefined && date !== '') {
                return moment(date).format('DD.MM.YY');
            } else {
                return date;
            }
        } else {
            if (date !== null && date !== undefined && date !== '' && date.includes('muaj') === false && date.includes('dite') === false && date.includes('ditë') === false && date.length > 3) {
                return moment(date).format('DD.MM.YY');
            } else {
                return date;
            }
        }
    }
    let formatPlanned = (planned) => {
        if (planned === 'po') {
            return '1';
        } else if (planned === 'jo') {
            return '2';
        } else {
            return '';
        }
    }
    let formatBudget = (budget) => {
        if (budget !== null) {
            if (budget[0] === "Të hyra vetanake" && budget.length === 1) {
                return "1";
            } else if (budget[0] === "Të hyra vetanake" && budget[1] === "Buxheti i Kosovës") {
                return "1+2";
            } else if (budget[0] === "Të hyra vetanake" && budget[1] === "Buxheti i Kosovës" && budget[3] === "Donacion") {
                return "1+2+3";
            } else if (budget[0] === "Të hyra vetanake" && budget[1] === "Donacion") {
                return "1+3";
            } else if (budget[0] === "Buxheti i Kosovës" && budget[1] === "Donacion") {
                return "2+3";
            } else if (budget[0] === "Buxheti i Kosovës" && budget.length === 1) {
                return "2";
            } else if (budget[0] === "Donacion" && budget.length === 1) {
                return "3";
            } else {
                return '';
            }
        } else {
            return "";
        }

    }
    let formatProcurementType = (type) => {
        if (type === "Furnizim") {
            return 1;
        } else if (type === "Shërbime") {
            return 2;
        } else if (type === "Shërbime keshillimi") {
            return 3;
        } else if (type === "Konkurs projektimi") {
            return 4;
        } else if (type === "Punë") {
            return 5;
        } else if (type === "Punë me koncesion") {
            return 4;
        } else if (type === "Prone e palujtshme") {
            return 4;
        } else {
            return "";
        }
    }
    let formatProcurementValue = (value) => {
        if (value === "Vlerë e madhe") {
            return 1;
        } else if (value === "Vlerë e mesme") {
            return 2;
        } else if (value === "Vlerë e vogël") {
            return 3;
        } else if (value === "Vlerë minimale") {
            return 4;
        } else {
            return "";
        }
    }
    let formatProcurementProcedure = (procedure) => {
        if (procedure === "Procedura e hapur") {
            return 1;
        } else if (procedure === "Procedura e kufizuar") {
            return 2;
        } else if (procedure === "Konkurs projektimi") {
            return 3;
        } else if (procedure === "Procedura e negociuar pas publikimit të njoftimit të kontratës") {
            return 4;
        } else if (procedure === "Procedura e negociuar pa publikimit të njoftimit të kontratës") {
            return 5;
        } else if (procedure === "Procedura e kuotimit të Çmimeve") {
            return 6;
        } else if (procedure === "Procedura e vlerës minimale") {
            return 7;
        } else {
            return "";
        }
    }
    let formatComplaints = (complaint) => {
        if (complaint === "negativ") {
            return 1;
        } else if (complaint === "pozitiv") {
            return 2;
        } else if (complaint === 'n/a') {
            return "n/a";
        } else {
            return "";
        }
    }
    let formatComplaintsSecond = (complaint) => {
        if (complaint === "nuk ka") {
            return 0;
        } else if (complaint === "negativ") {
            return 1;
        } else if (complaint === "pozitiv") {
            return 2;
        } else if (complaint === "n/a") {
            return "n/a";
        } else {
            return "";
        }
    }
    let formatCompanyType = (type) => {
        if (type === "vendor" || type === "OE Vendor") {
            return 1;
        } else if (type === "jo vendor" || type === "OE Jo vendor") {
            return 2;
        } else if (type === "n/a") {
            return "n/a";
        } else {
            return "";
        }
    }
    let formatApplicationDeadlineType = (type) => {
        if (type === "Afati kohor normal") {
            return 1;
        } else if (type === "Afati kohor i shkurtuar") {
            return 2;
        } else {
            return "";
        }
    }
    let formatCriteriaType = (criteria) => {
        if (criteria === "Çmimi më i ulët") {
            return 1;
        } else if (criteria === "Tenderi ekonomikisht më i favorshëm") {
            return 2;
        } else if (criteria === "Çmimi më i ulët me poentim") {
            return 3;
        } else {
            return "";
        }
    }
    let formatStatus = (status) => {
        if (status === "publikuar") {
            return 1;
        } else if (status === "vlerësim") {
            return 2;
        } else if (status === "anuluar") {
            return 3;
        } else if (status === "kontraktuar") {
            return 4;
        } else {
            return "";
        }
    }
    Contract.getContractsByYears(year).then(data => {
        if (data.length !== 0) {
            let fast_csv = csv.createWriteStream();
            let writeStream = fs.createWriteStream(`./prishtina-contracts-importer/data/procurements/${folder}/${year + '.csv'}`);
            fast_csv.pipe(writeStream);
            let largestInstallment = 0;
            let largestAnnex = 0;
            for (row of data) {
                for (t = 0; t < row.installments.length; t++) {
                    if (row.installments.length > largestInstallment) {
                        largestInstallment = row.installments.length;
                    }
                }
                for (t = 0; t < row.contract.annexes.length; t++) {
                    if (row.contract.annexes.length > largestAnnex) {
                        largestAnnex = row.contract.annexes.length;
                    }
                }
            }
            for (let i = 0; i < data.length; i++) {
                function mapRowsData() {
                    var finalDataArr = [];

                    finalDataArr.push([formatPlanned(data[i].planned)]);
                    finalDataArr.push([formatBudget(data[i].budget)]);
                    finalDataArr.push([data[i].procurementNo]);
                    finalDataArr.push([formatProcurementType(data[i].procurementType)]);
                    finalDataArr.push([formatProcurementValue(data[i].procurementValue)]);
                    finalDataArr.push([formatProcurementProcedure(data[i].procurementProcedure)]);
                    finalDataArr.push([data[i].fppClassification]);
                    finalDataArr.push([data[i].activityTitle]);
                    finalDataArr.push([formatDate(data[i].initiationDate)]);
                    finalDataArr.push([formatDate(data[i].approvalDateOfFunds)]);
                    finalDataArr.push([formatDate(data[i].torDate)]);
                    finalDataArr.push([formatDate(data[i].contract.publicationDate)]);
                    finalDataArr.push([formatComplaints(data[i].complaintsToAuthority1)]);
                    finalDataArr.push([formatComplaints(data[i].complaintsToOshp1)]);
                    finalDataArr.push([formatDate(data[i].bidOpeningDate)]);
                    finalDataArr.push([data[i].noOfCompaniesWhoDownloadedTenderDoc]);
                    finalDataArr.push([data[i].noOfCompaniesWhoSubmited]);
                    finalDataArr.push([formatDate(data[i].startingAndEndingEvaluationDate)]);
                    finalDataArr.push([data[i].noOfRefusedBids]);
                    finalDataArr.push([formatDate(data[i].reapprovalDate)]);
                    finalDataArr.push([formatDate(data[i].contract.publicationDateOfGivenContract)]);
                    finalDataArr.push([formatDate(data[i].cancellationNoticeDate)]);
                    finalDataArr.push([formatDate(data[i].company.standardDocuments)]);
                    finalDataArr.push([formatComplaintsSecond(data[i].complaintsToAuthority2)]);
                    finalDataArr.push([formatComplaintsSecond(data[i].complaintsToOshp2)]);
                    finalDataArr.push([data[i].contract.predictedValue]);
                    finalDataArr.push([formatCompanyType(data[i].company.type)]);
                    finalDataArr.push([formatApplicationDeadlineType(data[i].applicationDeadlineType)]);
                    finalDataArr.push([formatCriteriaType(data[i].contract.criteria)]);
                    finalDataArr.push([data[i].retender]);
                    finalDataArr.push([formatStatus(data[i].status)]);
                    finalDataArr.push([data[i].company.name]);
                    finalDataArr.push([formatDate(data[i].contract.signingDate)]);
                    finalDataArr.push([formatDate(data[i].contract.implementationDeadline)]);
                    finalDataArr.push([formatDate(data[i].contract.closingDate)]);
                    finalDataArr.push([data[i].contract.totalAmountOfContractsIncludingTaxes]);
                    finalDataArr.push([data[i].noOfPaymentInstallments]);
                    for (let k = 0; k < largestAnnex; k++) {
                        if (data[i].contract.annexes.length === largestAnnex) {
                            finalDataArr.push([formatDate(data[i].contract.annexes[k].annexContractSigningDate1)]);
                            finalDataArr.push([data[i].contract.annexes[k].totalValueOfAnnexContract1]);
                        } else if (data[i].contract.annexes[k] === undefined || data[i].contract.annexes[k] === [] || data[i].contract.annexes[k] === '') {
                            data[i].contract.annexes[k] = [
                                annexContractSigningDate1 = '',
                                totalValueOfAnnexContract1 = ''
                            ];
                            finalDataArr.push([formatDate(data[i].contract.annexes[k].annexContractSigningDate1)]);
                            finalDataArr.push([data[i].contract.annexes[k].totalValueOfAnnexContract1]);
                        } else {
                            if (k < data[i].contract.annexes.length) {
                                finalDataArr.push([formatDate(data[i].contract.annexes[k].annexContractSigningDate1)]);
                                finalDataArr.push([data[i].contract.annexes[k].totalValueOfAnnexContract1]);
                            } else {
                                data[i].contract.annexes[k].annexContractSigningDate1 = '';
                                data[i].contract.annexes[k].totalValueOfAnnexContract1 = '';
                                finalDataArr.push([formatDate(data[i].contract.annexes[k].annexContractSigningDate1)]);
                                finalDataArr.push([data[i].contract.annexes[k].totalValueOfAnnexContract1]);
                            }
                        }
                    }
                    for (let k = 0; k < largestInstallment; k++) {
                        if (data[i].installments.length === largestInstallment) {
                            finalDataArr.push([formatDate(data[i].installments[k].installmentPayDate1)]);
                            finalDataArr.push([data[i].installments[k].installmentAmount1]);
                        } else if (data[i].installments[k] === undefined || data[i].installments[k] === [] || data[i].installments[k] === '') {
                            data[i].installments[k] = [
                                installmentPayDate1 = '',
                                installmentAmount1 = ''
                            ];
                            finalDataArr.push([formatDate(data[i].installments[k].installmentPayDate1)]);
                            finalDataArr.push([data[i].installments[k].installmentAmount1]);
                        } else {
                            if (k < data[i].installments.length) {
                                finalDataArr.push([formatDate(data[i].installments[k].installmentPayDate1)]);
                                finalDataArr.push([data[i].installments[k].installmentAmount1]);
                            } else {
                                data[i].installments[k].installmentPayDate1 = '';
                                data[i].installments[k].installmentAmount1 = '';
                                finalDataArr.push([formatDate(data[i].installments[k].installmentPayDate1)]);
                                finalDataArr.push([data[i].installments[k].installmentAmount1]);
                            }
                        }
                    }
                    finalDataArr.push([data[i].contract.discountAmountFromContract]);
                    finalDataArr.push([formatDate(data[i].lastInstallmentPayDate)]);
                    finalDataArr.push([data[i].lastInstallmentAmount]);
                    finalDataArr.push([data[i].contract.totalPayedPriceForContract]);
                    finalDataArr.push([data[i].directorates]);
                    finalDataArr.push([data[i].nameOfProcurementOffical]);

                    return finalDataArr;
                }
                fast_csv.write(mapRowsData());
            }
            fast_csv.end();
            res.json({
                "msg": "Dataset updated successfully",
                "success": true
            })
        } else {
            res.json({
                "success": false,
                "msg": "No contracts for this year!"
            })
        };
    }).catch(err => {
        res.json(err);
    });

});

module.exports = router;