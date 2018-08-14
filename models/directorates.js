const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorateName: { type: String },
  peopleInCharge: [{}],
  directorateIsActive: { type: Boolean }
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
  newDirectorate.save(callback);
}

// Method for finding directorate by name
module.exports.findDirectorate = (directorateName, callback) => {
  Directorate.findOne({ "directorateName": directorateName }, callback);
}

// Method for counting the numbers of directorates
module.exports.countDirectorates = (callback) => {
  Directorate.count(callback);
}

// Method for getting all directorates
module.exports.getAllDirectorates = (role, directorateName, callback) => {
  if (role == "superadmin" || role == "admin") {
    Directorate.find(callback).sort({ _id: -1 });
  } else {
    Directorate.find({ directorateName: directorateName }, callback).sort({ _id: -1 });
  }
}

// Method for adding people in charge to a directorate
module.exports.addAndRemovePeopleInCharge = (directorateName, peopleInCharge, callback) => {
  Directorate.updateOne(
    { "directorateName": directorateName },
    { $set: { "peopleInCharge": peopleInCharge } }, callback
  );
}

// Method for finding directorate by id 
module.exports.getDirectorateById = (id, callback) => {
  Directorate.findById(id, callback);
}

// Method for editing a directorate
module.exports.updateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: directorate }, { new: true }, callback);
}

// Method for deactivating a directorate
module.exports.deactivateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: { directorateIsActive: false } }, { new: true }, callback);
}

// Method for activating a directorate
module.exports.activateDirectorate = (id, directorate, callback) => {
  Directorate.findByIdAndUpdate(id, { $set: { directorateIsActive: true } }, { new: true }, callback);
}

/** Data **/

// Total directorates
module.exports.totalDirectorates = () => Directorate.find().count();

// Get Total Directorates by status
module.exports.getTotalDirectoratesByStatus = status => Directorate.find({ directorateIsActive: status }).count();

// Get Total Directorates without people in charge
module.exports.getTotalDirectoratesWithoutPeopleInCharge = () => Directorate.find({ peopleInCharge: [] }).count();

// Get Total Directorates with people in charge
module.exports.getTotalDirectoratesWithPeopleInCharge = () => Directorate.find({ peopleInCharge: { $ne: [] } }).count();
