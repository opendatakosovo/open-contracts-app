const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorateName: { type: String },
  thePersonInChargeEmail: { type: String },
  directorateIsActive: { type: Boolean }
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
  newDirectorate.save(callback);
}
//Method for getting all directorates with persons in charge
module.exports.getAllDirectoratesWithPersonInCharge = (callback) => {
  Directorate.aggregate([{
    "$lookup": {
      "from": "users",
      "localField": "thePersonInChargeEmail",    // field in the orders collection
      "foreignField": "email",  // field in the items collection
      "as": "personInCharge"
    }
  },
  {
    "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$personInCharge", 0] }, "$$ROOT"] } }
  },
  { "$project": { "personInCharge": 0 } }
  ]).sort({ 'createdAt': "desc" })
    .exec(callback);;
}
//Method for finding directorate by name
module.exports.findDirectorate = (directorate, callback) => {
  Directorate.findOne({ "directorateName": directorate }, callback);
}
//Method for finding directorate by id 
module.exports.getDirectorateById = (id, callback) => {
  Directorate.findById(id, callback);
}
//Method for getting directorate and its person in charge by users email
module.exports.getDirectorateByEmail = (email, callback) => {
  Directorate.aggregate([{ "$match": { "thePersonInChargeEmail": email } },
  {
    "$lookup": {
      "from": "users",
      "localField": "thePersonInChargeEmail",
      "foreignField": "email",
      "as": "personInCharge"
    }
  },
  {
    "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$personInCharge", 0] }, "$$ROOT"] } }
  },
  { "$project": { "personInCharge": 0 } }
  ], callback);
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