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

Dataset.addDataset = (dataset) => {
    return dataset.save();
}

Dataset.getByName = (name, cb) => {
    Dataset.findOne({ datasetFilePath: name }, cb);
}

Dataset.updateByFilePath = (datasetFilePath, dataset) => {
    return Dataset.findOneAndUpdate({ "datasetFilePath": datasetFilePath }, { $set: { dataset } }, { new: true });
}

Dataset.getAllDatasets = cb => Dataset.find().sort({ 'datasetFilePath': 'descending' }).exec(cb);