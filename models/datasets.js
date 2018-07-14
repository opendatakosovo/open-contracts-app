const mongoose = require('mongoose');

const schemaOptions = {
    timestamps: true,
    versionKey: false
}

const datasetsSchema = mongoose.Schema({
    datasetFilePath: { type: String, required: true },
    folder: { type: String, required: true }
}, schemaOptions);

const Dataset = module.exports = mongoose.model("Dataset", datasetsSchema);

Dataset.addDataset = (dataset, cb) => {
    dataset.save(cb);
}

Dataset.getByName = (name, cb) => {
    Dataset.findOne({ datasetFilePath: name }, cb);
}