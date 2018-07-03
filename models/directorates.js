const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorateName: { type: String },
  thePersonInChargeEmail: { type: String },
  isActive: { type: Boolean }
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
    newDirectorate.save(callback);
}

//Method for getting all directorates with persons in charge
module.exports.getAllDirectoratesWithPersonInCharge = (callback) => {
  Directorate.aggregate([{ "$lookup": {
    "from": "users", 
    "localField": "thePersonInChargeEmail",
    "foreignField": "email",
    "as": "peopleInCharge"
  }}, {
    "$unwind": "$peopleInCharge"
  }], callback);
}

//Method for finding directorate by name
module.exports.findDirectorate = (directorate, callback) => {
  Directorate.findOne({"directorateName": directorate}, callback);
}

module.exports.getDirectorateById = (id, callback) => {
  Directorate.findById(id, callback);
}
// Method for editin a directorate
module.exports.updateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate(id, { $set: directorate } , {new: true }, callback);
}

//Method for deactivating a directorate
module.exports.deactivateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate ( id , {$set: {isActive: false }}, {new: true }, callback);
}

//Method for activating a directorate
module.exports.activateDirectorate = (id , directorate, callback ) => {
  Directorate.findByIdAndUpdate ( id , {$set: {isActive: true }}, {new: true }, callback);
}