const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorateName: { type: String },
  peopleInCharge:  [{}],
  directorateIsActive: { type: Boolean }
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
  newDirectorate.save(callback);
}
//Method for finding directorate by name
module.exports.findDirectorate = (directorate, callback) => {
  Directorate.findOne({ "directorateName": directorate }, callback);
}
//Method for counting the numbers of directorates
module.exports.countDirectorates = (callback) => {
  Directorate.count(callback);
}

//Method for getting all directorates
module.exports.getAllDirectorates = (callback) => {
  Directorate.find(callback);
}
//Method for adding people in charge to a directorate
module.exports.addAndRemovePeopleInCharge = (directorateName , peopleInCharge, callback) => {
  Directorate.updateOne(
    { "directorateName": directorateName} , 
    { $set: { "peopleInCharge": peopleInCharge}}, callback
  );
}
//Method for finding directorate by id 
module.exports.getDirectorateById = (id, callback) => {
  Directorate.findById(id, callback);
}
// Method for editing a directorate
module.exports.updateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: directorate }, { new: true }, callback);
}

//Method for deactivating a directorate
module.exports.deactivateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: { directorateIsActive: false } }, { new: true }, callback);
}

//Method for activating a directorate
module.exports.activateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: { directorateIsActive: true } }, { new: true }, callback);
}