const router = require('express').Router();
const Dataset = require('../../models/datasets');
const upload = require("../../utils/datasetStorage");
const reupload = require("../../utils/updateDatasetStorage");
const Contract = require('../../models/contracts');
const passport = require('passport');
const shell = require('shelljs');
const fs = require('fs');
const authorize = require('../../middlewares/authorization');


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

module.exports = router;