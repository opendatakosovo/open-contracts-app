const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const DirectorateSchema = mongoose.Schema({
  directorate: { type: String, required: true },
});
const Directorate = (module.exports = mongoose.model("Directorate", DirectorateSchema));

module.exports = mongoose.model("Directorate", DirectorateSchema);

// Method for creating a directorate
module.exports.addDirectorate = (newDirectorate, callback) => {
    newDirectorate.save(callback);
}
module.exports.findDirectorate = (directorate, callback) => {
  Directorate.findOne({"directorate": directorate}, callback);
}