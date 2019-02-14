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
                            Dataset.updateByFilePath(dataset.datasetFilePath, dataset).then(updatedDataset => {
                                res.json({
                                    "msg": "Dataset has been reimported successfully",
                                    "dataset": updatedDataset,
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

let formatData = {
    formatDate(date) {
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
    },
    formatPlanned(planned) {
        if (planned[0] && planned[0].documentType === 'procurementPlan') {
            return 'Po';
        } else if (!planned[0] || planned[0].documentType !== 'procurementPlan') {
            return 'Jo';
        } else {
            return '';
        }
    },
    formatBudget(budget) {
        if (budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return 'Të hyra vetanake';
        } else if (budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return 'Të hyra vetanake Buxheti i Kosovës';
        } else if (budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return 'Të hyra vetanake Buxheti i Kosovës Donacion';
        } else if (budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return 'Të hyra vetanake Donacion';
        } else if (!budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return 'Buxheti i Kosovës Donacion';
        } else if (!budget.includes('Të hyra vetanake') && budget.includes('Buxheti i Kosovës') && !budget.includes('Donacion')) {
            return 'Buxheti i Kosovës';
        } else if (!budget.includes('Të hyra vetanake') && !budget.includes('Buxheti i Kosovës') && budget.includes('Donacion')) {
            return 'Donacion';
        } else {
            return '';
        }
    },
    formatProcurementType(type) {
        if (type === "goods") {
            return 'Furnizim';
        } else if (type === "services") {
            return 'Shërbime';
        } else if (type === "consultingServices") {
            return 'Shërbime këshillimi';
        } else if (type === "designContest") {
            return 'Konkurs projektimi';
        } else if (type === "works") {
            return 'Punë';
        } else if (type === "concessionWorks") {
            return 'Punë me koncesion';
        } else if (type === "immovableProperty") {
            return 'Pronë e palujtshme';
        } else {
            return "";
        }
    },
    formatProcurementValue(value) {
        if (value === "bigValue") {
            return 'Vlerë e madhe';
        } else if (value === "mediumValue") {
            return 'Vlerë e mesme';
        } else if (value === "smallValue") {
            return 'Vlerë e vogël';
        } else if (value === "minimalValue") {
            return 'Vlerë minimale';
        } else {
            return "";
        }
    },
    formatProcurementProcedure(procedure) {
        if (procedure === "openProcedure") {
            return 'Procedura e hapur';
        } else if (procedure === "limitedProcedure") {
            return 'Procedura e kufizuar';
        } else if (procedure === "designContest") {
            return 'Konkurs projektimi';
        } else if (procedure === "negociatedProcedureAfterAwardNotice") {
            return 'Procedura e negociuar pas publikimit të njoftimit të kontratës';
        } else if (procedure === "negociatedProcedureWithoutAwardNotice") {
            return 'Procedura e negociuar pa publikim të njoftimit të kontratës';
        } else if (procedure === "quotationValueProcedure") {
            return 'Procedura e kuotimit të Çmimeve';
        } else if (procedure === "minimalValueProcedure") {
            return 'Procedura e vlerës minimale';
        } else {
            return "";
        }
    },
    formatComplaints(complaint) {
        if (complaint === false) {
            return 'Negative';
        } else if (complaint === true) {
            return 'Pozitive';
        } else {
            return "";
        }
    },
    formatComplaintsSecond(complaint) {
        if (complaint === "none") {
            return 'Nuk ka';
        } else if (complaint === "negative") {
            return 'Negative';
        } else if (complaint === "positive") {
            return 'Pozitive';
        } else {
            return "";
        }
    },
    formatCompanyType(type) {
        if (type) {
            if (type.local === true) {
                return 'Vendore';
            } else if (type.local === false) {
                return 'Jo vendore';
            } else {
                return '';
            }
        } else {
            return '';
        }

    },
    formatApplicationDeadlineType(type) {
        if (type === true) {
            return 'Afati kohor normal';
        } else if (type === false) {
            return 'Afati kohor i shkurtuar';
        } else {
            return "";
        }
    },
    formatCriteriaType(criteria) {
        if (criteria === "priceOnly") {
            return 'Çmimi më i ulët';
        } else if (criteria === "costOnly") {
            return 'Tenderi ekonomikisht më i favorshëm';
        } else if (criteria === "ratedCriteria") {
            return 'Çmimi më i ulët me poentim';
        } else {
            return "";
        }
    },
    formatStatus(status, starting, ending) {
        if (status === "active" && starting && ending) {
            return 'Vlerësim';
        } else if (status === "active") {
            return 'Publikuar';
        } else if (status === "cancelled") {
            return 'Anuluar';
        } else if (status === "complete") {
            return 'Kontraktuar';
        } else {
            return "";
        }
    },
    fppClassification(fppNumber) {
        if (fppNumber[0] && fppNumber[0].quantity) {
            return fppNumber[0].quantity;
        } else {
            return '';
        }
    },
    retenderChecker(retender) {
        if (retender && retender.relationship === 'unsuccessfulProcess') {
            return 'Po';
        } else {
            return 'Jo';
        }
    }
}

function writeCsv(value, folder, field, res) {
    let getFunctions;
    if (field === 'year') {
        getFunctions = Contract.getContractsByYears(value);
    } else if (field === 'directorate') {
        getFunctions = Contract.getContractsByDirectorate(value);
    } else if (field === 'companyName') {
        getFunctions = Contract.getContractsByContractorCompany(value);
    }

    getFunctions.then(data => {

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
        res.setHeader('Content-disposition', `attachment; filename=${value + '.csv'}`);
        res.setHeader('content-type', 'text/csv');
        let fast_csv = csv.createWriteStream({
            headers: headerArray,
            objectMode: true
        });
        // let writeStream = fs.createWriteStream(`./prishtina-contracts-importer/data/procurements/${folder}/${value + '.csv'}`);
        fast_csv.pipe(res);
        if (data.length > 0) {
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

                headerArray.push('Data e nënshkrimit të Aneks kontratës(' + i + ')');
                headerArray.push('Vlera totale e Aneks kontratës duke përfshirë të gjitha taksat(' + i + ')');
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
                            finalDataArr.push([formatData.formatPlanned(data[i].releases[0].planning.documents)]);
                        } else {
                            finalDataArr.push('');
                        }
                        finalDataArr.push([formatData.formatBudget(data[i].releases[0].planning.budget.description)]);
                        finalDataArr.push([data[i].releases[0].tender.id]);
                        finalDataArr.push([formatData.formatProcurementType(data[i].releases[0].tender.additionalProcurementCategories)]);
                        finalDataArr.push([formatData.formatProcurementValue(data[i].releases[0].tender.estimatedSizeOfProcurementValue.estimatedValue)]);
                        finalDataArr.push([formatData.formatProcurementProcedure(data[i].releases[0].tender.procurementMethodRationale)]);
                        finalDataArr.push([formatData.fppClassification(data[i].releases[0].tender.items)]);
                        finalDataArr.push([data[i].releases[0].tender.title]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].planning.milestones[0].dateMet)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].planning.milestones[1].dateMet)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].planning.milestones[2].dateMet)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].tender.date)]);
                        finalDataArr.push([formatData.formatComplaints(data[i].releases[0].tender.hasEnquiries)]);
                        finalDataArr.push([formatData.formatComplaints(data[i].releases[0].tender.hasComplaints)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].tender.tenderPeriod.startDate)]);
                        finalDataArr.push([data[i].releases[0].bids.statistics[0].value]);
                        finalDataArr.push([data[i].releases[0].tender.numberOfTenderers]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].tender.awardPeriod.durationInDays)]);
                        finalDataArr.push([data[i].releases[0].bids.statistics[1].value]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].planning.milestones[3].dateMet)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].awards[0].date)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].tender.milestones[1].dateMet)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].tender.milestones[0].dateMet)]);
                        finalDataArr.push([formatData.formatComplaintsSecond(data[i].releases[0].awards[0].enquiryType)]);
                        finalDataArr.push([formatData.formatComplaintsSecond(data[i].releases[0].awards[0].complaintType)]);
                        finalDataArr.push([data[i].releases[0].planning.budget.amount.amount]);
                        finalDataArr.push([formatData.formatCompanyType(data[i].releases[0].parties[0].details)]);
                        finalDataArr.push([formatData.formatApplicationDeadlineType(data[i].releases[0].tender.procedure.isAcceleratedProcedure)]);
                        finalDataArr.push([formatData.formatCriteriaType(data[i].releases[0].tender.awardCriteria)]);
                        finalDataArr.push([formatData.retenderChecker(data[i].releases[0].relatedProcesses[0])]);
                        finalDataArr.push([formatData.formatStatus(data[i].releases[0].tender.status, data[i].releases[0].tender.awardPeriod.startDate, data[i].releases[0].tender.awardPeriod.endDate)]);
                        finalDataArr.push([data[i].releases[0].tender.tenderers[0].name]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].period.startDate)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].period.durationInDays)]);
                        finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].period.endDate)]);
                        finalDataArr.push([data[i].releases[0].tender.value.amount]);
                        finalDataArr.push([data[i].releases[0].contracts[0].expectedNumberOfTransactions]);
                        for (let k = 0; k < largestAnnex; k++) {
                            if (data[i].releases[0].contracts[0].amendments.length === largestAnnex) {
                                finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                            } else if (data[i].releases[0].contracts[0].amendments[k] === undefined || data[i].releases[0].contracts[0].amendments[k] === [] || data[i].releases[0].contracts[0].amendments[k] === null) {
                                data[i].releases[0].contracts[0].amendments[k] = [
                                    date = '',
                                    description = ''
                                ];
                                finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                            } else {
                                if (k < data[i].releases[0].contracts[0].amendments.length) {
                                    finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                                } else {
                                    data[i].releases[0].contracts[0].amendments[k].date = '';
                                    data[i].releases[0].contracts[0].amendments[k].description = '';
                                    finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].amendments[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].amendments[k].description]);
                                }
                            }
                        }
                        for (let k = 0; k < largestInstallment; k++) {
                            if (data[i].releases[0].contracts[0].implementation.transactions.length === largestInstallment) {
                                finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                            } else if (data[i].releases[0].contracts[0].implementation.transactions[k] === undefined || data[i].releases[0].contracts[0].implementation.transactions[k] === [] || data[i].releases[0].contracts[0].implementation.transactions[k] === null) {
                                data[i].releases[0].contracts[0].implementation.transactions[k] = [
                                    date = '',
                                    value = ''
                                ];
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].date]);
                                finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value]);
                            } else {
                                if (k < data[i].releases[0].contracts[0].implementation.transactions.length) {
                                    finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                                } else {
                                    data[i].releases[0].contracts[0].implementation.transactions[k].date = '';
                                    data[i].releases[0].contracts[0].implementation.transactions[k].value.amount = 0;
                                    finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].implementation.transactions[k].date)]);
                                    finalDataArr.push([data[i].releases[0].contracts[0].implementation.transactions[k].value.amount]);
                                }
                            }
                        }
                        finalDataArr.push([data[i].releases[0].contracts[0].deductionAmountFromContract.value.amount]);
                        if (data[i].releases[0].contracts[0].implementation.transactions.length > 0 && data[i].releases[0].contracts[0].implementation.transactions[largestInstallment - 1].date) {
                            finalDataArr.push([formatData.formatDate(data[i].releases[0].contracts[0].implementation.transactions[largestInstallment - 1].date)]);
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
                "msg": "Dataset downloaded successfully",
                "success": true
            })
        } else {
            res.json({
                "success": false,
                "msg": "No contracts for this year!"
            });
        };
    }).catch(err => {
        res.json(err);
    });
}

router.get("/csv/:field/:value", (req, res) => {
    let value = req.params.value.replace('.csv', '');;
    let folder;
    let field = req.params.field;
    if (field === 'year') {
        if (value === '2010' || value === '2011' || value === '2012' || value === '2013' || value === '2014' || value === '2015' || value === '2016') {
            folder = 'old';
        } else {
            folder = 'new';
        }
    } else if (field === 'directorate' || field === 'companyName') {
        folder = 'new';
    }
    writeCsv(value, folder, field, res);
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
router.get('/json/:field/:value', (req, res) => {
    let field = req.params.field;
    let value = req.params.value;
    let getFunctions;
    if (field === 'year') {
        getFunctions = Contract.getContractsByYears(value);
    } else if (field === 'directorate') {
        getFunctions = Contract.getContractsByDirectorate(value);
    } else if (field === 'companyName') {
        getFunctions = Contract.getContractsByContractorCompany(value);
    }
    getFunctions
        .then(data => {
            if (data.length > 0) {
                let fileName = `${value}.json`;
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

module.exports = router;