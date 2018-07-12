const mongoose = require('mongoose');

const datasetsSchema = mongoose.Schema({
    datasetFilePath: { type: String, required: true },
    folder: { type: String, required: true }
});

const Dataset = module.exports = mongoose.model("Dataset", datasetsSchema);

Dataset.addDataset = (dataset, cb) => {
    dataset.new(cb);
}