const router = require('express').Router();
const Dataset = require('../../models/datasets');
const upload = require("../../utils/datasetStorage");
const passport = require('passport');
const datasetValidation = require('../../middlewares/dataset_file_validation');
const shell = require('shelljs');
let exec = require('child_process').exec, child;


router.get("/", (req, res) => {
    res.json("blank");
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
module.exports = router;