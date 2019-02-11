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

router.post("/", passport.authenticate('jwt', {
    session: false
}), authorize('superadmin', 'admin'), upload.single('datasetFile'), (req, res) => {
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
    shell.exec(`bash run-with-args.sh ${csv}`, {
        async: true
    }, cb);
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

router.put('/update', passport.authenticate('jwt', {
    session: false
}), authorize('superadmin', 'admin'), reupload.single('datasetFile'), (req, res) => {
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
            if (date !== null && date !== undefined && date !== '' && date !== "undefined undefined" && date !== "undefined-undefined" && date !== "n/a undefined" && date !== "n/a" && date !== "undefined ") {
                return moment(date).format('DD.MM.YY');
            } else if (date === null || date === undefined || date === "undefined undefined" || date === "undefined-undefined" || date === "n/a undefined" || date === "n/a" || date === "undefined ") {
                return "";
            } else {
                return date;
            }
        } else {
            if (date !== null && date !== undefined && date !== "undefined undefined" && date !== "undefined-undefined" && date !== '' && date.includes('Muaj') === false && date.includes('Ditë') === false && date.includes('Vite') === false && date.includes('muaj') === false && date.includes('dite') === false && date.includes('ditë') === false && date.length > 3 && date !== "n/a undefined" && date !== "n/a" && date !== "undefined " && date.includes('Dite') === false) {
                return moment(date).format('DD.MM.YY');
            } else if (date === null || date === undefined || date === "undefined undefined" || date === "undefined-undefined" || date === "n/a undefined" || date === "n/a" || date === "undefined ") {
                return "";
            } else {
                if (date.includes('undefined') && (date.includes('Muaj') === true || date.includes('Ditë') === true || date.includes('Vite') === true || date.includes('muaj') === true || date.includes('dite') === true || date.includes('ditë') === true) || date.includes('Dite') === true) {
                    return date.split("undefined");
                } else if (date.includes('-') && (date.includes('Muaj') === true || date.includes('Ditë') === true || date.includes('Vite') === true || date.includes('muaj') === true || date.includes('dite') === true || date.includes('ditë') === true) || date.includes('Dite')) {
                    return date.split('-');
                } else {
                    return date;
                }

            }
        }
    }
    let formatPlanned = (planned) => {
        if (planned[0] && planned[0].documentType === 'procurementPlan') {
            return '1';
        } else if (!planned[0] || planned[0].documentType !== 'procurementPlan') {
            return '2';
        } else {
            return '';
        }
    }
    let formatBudget = (budget) => {
        if (budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return '1';
        } else if (budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return '1+2';
        } else if (budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return '1+2+3';
        } else if (budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return '1+3';
        } else if (!budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return '2+3';
        } else if (!budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return '2';
        } else if (!budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return '3';
        } else {
            return '';
        }
    }
    let formatProcurementType = (type) => {
        if (type === "goods") {
            return 1;
        } else if (type === "services") {
            return 2;
        } else if (type === "consultingServices") {
            return 3;
        } else if (type === "designContest") {
            return 4;
        } else if (type === "works") {
            return 5;
        } else if (type === "concessionWorks") {
            return 6;
        } else if (type === "immovableProperty") {
            return 7;
        } else {
            return "";
        }
    }
    let formatProcurementValue = (value) => {
        if (value === "bigValue") {
            return 1;
        } else if (value === "mediumValue") {
            return 2;
        } else if (value === "smallValue") {
            return 3;
        } else if (value === "minimalValue") {
            return 4;
        } else {
            return "";
        }
    }
    let formatProcurementProcedure = (procedure) => {
        if (procedure === "openProcedure") {
            return 1;
        } else if (procedure === "limitedProcedure") {
            return 2;
        } else if (procedure === "designContest") {
            return 3;
        } else if (procedure === "negociatedProcedureAfterAwardNotice") {
            return 4;
        } else if (procedure === "negociatedProcedureWithoutAwardNotice") {
            return 5;
        } else if (procedure === "quotationValueProcedure") {
            return 6;
        } else if (procedure === "minimalValueProcedure") {
            return 7;
        } else {
            return "";
        }
    }
    let formatComplaints = (complaint) => {
        if (complaint === false) {
            return 1;
        } else if (complaint === true) {
            return 2;
        } else {
            return "";
        }
    }
    let formatComplaintsSecond = (complaint) => {
        if (complaint === "none") {
            return 0;
        } else if (complaint === "negative") {
            return 1;
        } else if (complaint === "positive") {
            return 2;
        } else {
            return "";
        }
    }
    let formatCompanyType = (type) => {
        if (type) {
            if (type.local === true) {
                return 1;
            } else if (type.local === false) {
                return 2;
            } else {
                return '';
            }
        } else {
            return '';
        }

    }
    let formatApplicationDeadlineType = (type) => {
        if (type === true) {
            return 1;
        } else if (type === false) {
            return 2;
        } else {
            return "";
        }
    }
    let formatCriteriaType = (criteria) => {
        if (criteria === "priceOnly") {
            return 1;
        } else if (criteria === "costOnly") {
            return 2;
        } else if (criteria === "ratedCriteria") {
            return 3;
        } else {
            return "";
        }
    }
    let formatStatus = (status, starting, ending) => {
        if (status === "active" && starting && ending) {
            return 2;
        } else if (status === "active") {
            return 1;
        } else if (status === "cancelled") {
            return 3;
        } else if (status === "complete") {
            return 4;
        } else {
            return "";
        }
    }
    let fppClassification = (fppNumber) => {
        if (fppNumber && fppNumber.quantity) {
            return fppNumber.quantity;
        } else {
            return '';
        }
    }
    let retenderChecker = (retender) => {
        if (retender && retender.relationship === 'unsuccessfulProcess') {
            return 'Po';
        } else {
            return 'Jo';
        }
    }
    Contract.getContractsByYears(year).then(data => {
        var headerArray = ['Planifikuar', 'Buxheti', 'Numri prokurimit', 'Lloji i prokurimit', 'Vlera e prokurimit', 'Procedura e prokutimiy',
            'Klasifikimi(2 shifrat e para te FPP)', 'Titulli i aktivitetit te prokurimit', 'Data e inicimit të aktivitetit të prokurimit (data e pranimit të kërkesës)',
            'Data e aprovimit të deklaratës së nevojave dhe disponueshmërisë së mjeteve', 'Data e pranimit të specifikimit teknik (TOR)', 'Data e publikimit të njoftimit për kontratë',
            'Ankesat në autoritet', 'Ankesat në OSHP', 'Data e hapjes së ofertave', 'Nr. i OE që kanë shkarkuar dosjen e tenderit', 'Nr. i OE që kanë dorëzuar ofertat',
            'Data e fillimit dhe përfundimit të vlersimit', 'Numri i ofertave të refuzuara', 'Data e aprovimit të Deklaratës së nevojave dhe disponueshmërisë së mjeteve - rikonfirmimi',
            'Data e publikimit të njoftimit për dhënie të kontratës', 'Data e publikimit të anulimit të njoftimit', 'Letrat Standarde për OE', 'Ankesat në autoritet', 'Ankesat në OSHP',
            'Vlera e parashikuar e kontratës', 'OE', 'Afati kohor për pranimin e tenderëve', 'Kriteret për dhënie të kontratës', 'Re-tenderimi', 'Statusi', 'Emri i OE të cilit i është dhënë kontrata',
            'Data e nënshkrimit të kontratës', 'Afati për implementimin e kontratës', 'Data e mbylljes së kontratës', 'Vlera totale e kontratës, duke përfshirë të gjitha taksat',
            'Numri i përgjithshëm i situacioneve për pagesë, sipas kontratës'
        ];
        if (data.length !== 0) {
            let fast_csv = csv.createWriteStream({
                headers: true
            });
            let writeStream = fs.createWriteStream(`./prishtina-contracts-importer/data/procurements/${folder}/${year + '.csv'}`);
            fast_csv.pipe(writeStream);
            let largestInstallment = 0;
            let largestAnnex = 0;
            for (row of data) {
                for (t = 0; t < row.releases[0].contracts[0].amendments.length; t++) {
                    if (row.releases[0].contracts[0].amendments.length > largestAnnex) {
                        largestAnnex = row.releases[0].contracts[0].amendments.length;
                    }
                }
                for (t = 0; t < row.releases[0].contracts[0].implementation.transactions.length; t++) {
                    if (row.releases[0].contracts[0].implementation.transactions.length > largestInstallment) {
                        largestInstallment = row.releases[0].contracts[0].implementation.transactions.length;
                    }
                }
            }
            for (let i = 1; i <= largestAnnex; i++) {

                headerArray.push('Vlera totale e Aneks kontratës duke përfshirë të gjitha taksat(' + i + ')');
                headerArray.push('Data e nënshkrimit të Aneks kontratës(' + i + ')');
            }
            for (let i = 1; i <= largestInstallment; i++) {
                headerArray.push('Data e pagesës së situacionit(' + i + ')');
                headerArray.push('Shuma e pagesës së situacionit(' + i + ')');
            }
            headerArray.push('Shuma e zbritjes nga kontrata për shkaqe të ndalesave', 'Data e pagesës së situacionit të fundit', 'Shuma e pagesës së situacionit të fundit',
                'Çmimi total i paguar për kontratën', 'Drejtoria', 'Emri i zyrtarit të prokurimit');

            for (let i = -1; i < data.length; i++) {
                function mapRowsData() {
                    var finalDataArr = [];
                    if (i === -1) {
                        finalDataArr = headerArray;
                    } else {
                        if (data[i].releases[0].planning.documents[0]) {
                            finalDataArr.push([formatPlanned(data[i].releases[0].planning.documents)]);
                        } else {
                            finalDataArr.push('');
                        }
                        finalDataArr.push([formatBudget(data[i].releases[0].planning.budget.description)]);
                        finalDataArr.push([data[i].releases[0].tender.id]);
                        finalDataArr.push([formatProcurementType(data[i].releases[0].tender.additionalProcurementCategories)]);
                        finalDataArr.push([formatProcurementValue(data[i].releases[0].tender.estimatedSizeOfProcurementValue.estimatedValue)]);
                        finalDataArr.push([formatProcurementProcedure(data[i].releases[0].tender.procurementMethodRationale)]);
                        finalDataArr.push([fppClassification(data[i].releases[0].tender.items)]);
                        finalDataArr.push([data[i].releases[0].tender.title]);
                        finalDataArr.push([formatDate(data[i].releases[0].planning.milestones[0].dateMet)]);
                        finalDataArr.push([formatDate(data[i].releases[0].planning.milestones[1].dateMet)]);
                        finalDataArr.push([formatDate(data[i].releases[0].planning.milestones[2].dateMet)]);
                        finalDataArr.push([formatDate(data[i].releases[0].tender.date)]);
                        finalDataArr.push([formatComplaints(data[i].releases[0].tender.hasEnquiries)]);
                        finalDataArr.push([formatComplaints(data[i].releases[0].tender.hasComplaints)]);
                        finalDataArr.push([formatDate(data[i].releases[0].tender.tenderPeriod.startDate)]);
                        finalDataArr.push([data[i].releases[0].bids.statistics[0].value]);
                        finalDataArr.push([data[i].releases[0].tender.numberOfTenderers]);
                        finalDataArr.push([formatDate(data[i].releases[0].tender.awardPeriod.durationInDays)]);
                        finalDataArr.push([data[i].releases[0].bids.statistics[1].value]);
                        finalDataArr.push([formatDate(data[i].releases[0].planning.milestones[3].dateMet)]);
                        finalDataArr.push([formatDate(data[i].releases[0].awards[0].date)]);
                        finalDataArr.push([formatDate(data[i].releases[0].tender.milestones[1].dateMet)]);
                        finalDataArr.push([formatDate(data[i].releases[0].tender.milestones[0].dateMet)]);
                        finalDataArr.push([formatComplaintsSecond(data[i].releases[0].awards[0].enquiryType)]);
                        finalDataArr.push([formatComplaintsSecond(data[i].releases[0].awards[0].complaintType)]);
                        finalDataArr.push([data[i].releases[0].planning.budget.amount.amount]);
                        finalDataArr.push([formatCompanyType(data[i].releases[0].parties[0].details)]);
                        finalDataArr.push([formatApplicationDeadlineType(data[i].releases[0].tender.procedure.isAcceleratedProcedure)]);
                        finalDataArr.push([formatCriteriaType(data[i].releases[0].tender.awardCriteria)]);
                        finalDataArr.push([retenderChecker(data[i].releases[0].relatedProcesses[0])]);
                        finalDataArr.push([formatStatus(data[i].releases[0].tender.status, data[i].releases[0].tender.awardPeriod.startDate, data[i].releases[0].tender.awardPeriod.endDate)]);
                        finalDataArr.push([data[i].releases[0].tender.tenderers[0].name]);
                        finalDataArr.push([formatDate(data[i].releases[0].contracts[0].period.startDate)]);
                        finalDataArr.push([formatDate(data[i].releases[0].contracts[0].period.durationInDays)]);
                        finalDataArr.push([formatDate(data[i].releases[0].contracts[0].period.endDate)]);
                        finalDataArr.push([data[i].releases[0].tender.value.amount]);
                        finalDataArr.push([data[i].releases[0].contracts[0].expectedNumberOfTransactions]);
                        for (let k = 0; k < largestAnnex; k++) {
                            if (data[i].releases[0].contracts[0].implementation.transactions.length === largestAnnex) {
                                finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                            } else if (data[i].releases[0].contracts[0].implementation.transactions[k] === undefined || data[i].contract.annexes[k] === [] || data[i].releases[0].contracts[0].implementation.transactions[k] === null) {
                                data[i].releases[0].contracts[0].implementation.transactions[k] = [
                                    date = '',
                                    value.amount = 0
                                ];
                                finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                            } else {
                                if (k < data[i].contract.annexes.length) {
                                    finalDataArr.push([formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                                } else {
                                    data[i].releases[0].contracts[0].amendments[k].date = '';
                                    data[i].releases[0].contracts[0].amendments[k].description = '';
                                    finalDataArr.push([formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                                }
                            }
                        }
                        for (let k = 0; k < largestInstallment; k++) {
                            if (data[i].releases[0].contracts[0].implementation.transactions.length === largestInstallment) {
                                finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                            } else if (data[i].releases[0].contracts[0].implementation.transactions[k] === undefined || data[i].releases[0].contracts[0].implementation.transactions[k] === [] || data[i].releases[0].contracts[0].implementation.transactions[k] === '') {
                                data[i].releases[0].contracts[0].implementation.transactions[k] = [
                                    date = '',
                                    value.amount = 0
                                ];
                                finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                            } else {
                                if (k < data[i].releases[0].contracts[0].implementation.transactions.length) {
                                    finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                                } else {
                                    data[i].releases[0].contracts[0].implementation.transactions[k].date = '';
                                    data[i].releases[0].contracts[0].implementation.transactions[k].value.amount = 0;
                                    finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                                }
                            }
                        }
                        finalDataArr.push([data[i].releases[0].contracts[0].deductionAmountFromContract.value.amount]);
                        if (largestInstallment > 0) {
                            finalDataArr.push([formatDate(data[i].releases[0].contracts[0].implementation.transactions[largestInstallment - 1].date)]);
                            finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[largestInstallment - 1].value.amount]);

                        } else {
                            finalDataArr.push('');
                            finalDataArr.push('');
                        }
                        finalDataArr.push([data[i].releases[0].contracts[0].implementation.finalValue.amount]);
                        finalDataArr.push([data[i].releases[0].buyer.name]);
                        finalDataArr.push([data[i].releases[0].parties[1].contactPoint.name]);
                    }
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