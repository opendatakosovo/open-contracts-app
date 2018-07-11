const router = require('express').Router();
const Dataset = require('../../models/datasets');
const upload = require("../../utils/datasetStorage");

router.get("/", (req, res) => {
    res.json("blank");
});

router.post("/", upload.single('dataset'), (req, res) => {
    const dataset = new Dataset({
        datasetFilePath: req.file.originalname,
        folder: "new"
    });
    Dataset.addDataset(dataset, (err, dataset) => {
        if (!err) {
            res.json({
                "msg": "Dataset has been added successfully",
                "dataset": contract,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    })
})

module.exports = router;