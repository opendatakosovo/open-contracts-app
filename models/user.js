const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");
const ObjectId = require("mongoose").Types.ObjectId;




const schemaOptions = {
  timestamps: true,
  versionKey: false
}
// User Schema
const UserSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  directorateName: { type: String },
  isInCharge: { type: Boolean },
  isActive: { type: Boolean, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, schemaOptions);

UserSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.password;
  }
}


UserSchema.pre('save', function (next) {
  var user = this;
  var SALT_FACTOR = 10;

  // if password field is not changed go next and skip bcrypt
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

const User = (module.exports = mongoose.model("User", UserSchema));

// Function for getting all users and directorates
module.exports.getAllUsers = callback => {
  User.find().sort({ 'createdAt': "desc" }).exec(callback);;
}

module.exports.getAllSimpleUsers = () => {
  return User.find({ role: 'user', isActive: true });
}

module.exports.getAllAdminUsers = () => {
  return User.aggregate([
    { $match: { role: { $in: ['admin', 'superadmin'] } } }
  ]);
}

// Function for get a user by id
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
}

// Updating user information
module.exports.updateUser = (id, user, callback) => {
  User.findByIdAndUpdate(id, { $set: user }, { new: true }, callback);
}

// Function for adding user
module.exports.addUser = (newUser, callback) => {
  newUser.save(callback);
}
//Function for deleting a user
module.exports.deleteUserById = (id, callback) => {
  User.findByIdAndRemove(id, callback);
}
// Function for getting user by email
module.exports.findUserByEmail = (email, callback) => {
  User.findOne({ "email": email }, callback);
}
module.exports.findRegularUserAndAdminsByEmail = (email, callback) => {
  User.findOne({ "email": email, "role": { $in: ['user', 'admin'] } }, callback);
}
//Function for getting superadmin
module.exports.getSuperadmin = () => {
  return User.findOne({ "role": "superadmin" });
}
// Function for finding active users
module.exports.activeUsers = (callback) => {
  User.find({ "isActive": true, "role": "user", "isInCharge": false }, callback);
}
// Function for comparing passwords
module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

// Function for changing password
module.exports.changePassword = (id, newPassword, callback) => {
  User.findByIdAndUpdate(id, {
    $set: {
      password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null)
    }
  }, { new: true }, callback);
}
// Function for activating a user or admin
module.exports.activateUser = (id, callback) => {
  User.findByIdAndUpdate(id, { $set: { isActive: true } }, { new: true }, callback);
}
// Function for deactivating a user or admin
module.exports.deactivateUser = (id, callback) => {
  User.findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true }, callback);
}

/** User data ***/
// Total users
module.exports.totalUsers = () => User.find({ role: { $ne: "superadmin" } }).count();

// Total active/inactive users
module.exports.getTotalUsersByStatus = status => User.find({ isActive: status, role: { $ne: "superadmin" } }).count();

// Total users with/without directorates assigned
module.exports.getTotalUsersByDirectoratesStatus = status => User.find({ isInCharge: status, role: { $ne: "admin" }, isActive: true }).count();

// Total admin/simple users
module.exports.getTotalUsersByRole = role => User.find({ role: role }).count();