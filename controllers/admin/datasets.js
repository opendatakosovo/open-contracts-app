const router = require('express').Router();
const Dataset = require('../../models/datasets');
const upload = require("../../utils/datasetStorage");
const Contract = require('../../models/contracts');
const passport = require('passport');
const datasetValidation = require('../../middlewares/dataset_file_validation');
const shell = require('shelljs');
let exec = require('child_process').exec, child;


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

router.post("/", passport.authenticate('jwt', { session: false }), upload.single('datasetFile'), (req, res) => {

    if (req.fileExist) {
        res.json({
            "existErr": "File exsit",
            "success": false
        });
    } else if (req.typeValidation) {
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
        const dataset = new Dataset({
            datasetFilePath: req.file.originalname,
            folder: "new"
        });
        Dataset.addDataset(dataset, (err, dataset) => {
            if (!err) {
                importCsv(dataset.datasetFilePath, (error, stdout, stderr) => {
                    if (!error) {
                        if (!stderr) {
                            res.json({
                                "msg": "Dataset has been imported successfully",
                                "dataset": dataset,
                                "success": false
                            });
                        } else {
                            res.json({
                                "shellErr": stderr,
                                "success": false
                            });
                        }
                    } else {
                        res.json({
                            "shelljsErr": err,
                            "success": false
                        });
                    }
                });
            } else {
                res.json({
                    "err": err,
                    "success": false
                });
            }
        })
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
    shell.exec(`sh run-with-args.sh ${csv}`, { async: true }, cb);
    shell.cd("..");
};

// Get all contracts by years and send as JSON file response
router.get('/json/:year', (req, res) => {
    Contract.getContractsByYears(req.params.year)
        .then(data => {
            if (data.length !== 0) {
                let fileName = `${req.params.year}.json`;
                let mimeType = 'application/json';
                res.setHeader('Content-Type', mimeType);
                res.setHeader('Content-disposition', 'attachment; filename='+fileName);
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

module.exports = router;