const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorateName: { type: String },
  thePersonInCharge: { type: String },
  isActive: { type: Boolean }
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
    newDirectorate.save(callback);
}

module.exports.findDirectorate = (directorate, callback) => {
  Directorate.findOne({"directorateName": directorate}, callback);
}

module.exports.getAllDirectorates = callback => {
  Directorate.find(callback);
}

module.exports.getDirectorateById = (id, callback) => {
  Directorate.findById(id, callback);
}

module.exports.updateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate(id, { $set: directorate } , {new: true }, callback);
}
module.exports.deactivateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate ( id , {$set: {isActive: false }}, {new: true }, callback);
}

module.exports.activateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate ( id , {$set: {isActive: true }}, {new: true }, callback);
}