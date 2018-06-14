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
  department: { type: String, set: skipEmpty }
}, schemaOptions);

UserSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.password;
  }
}


UserSchema.pre('save', function (next){
  var user = this;
	var SALT_FACTOR = 10;

	// if password field is not changed go next and skip bcrypt
	if(!user.isModified('password')) return next();

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

module.exports.deleteUserById = (id, callback) => {
  User.findByIdAndRemove(id, callback);
}

// Function for get a user by id
module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

// Function for getting all users
module.exports.getAllUsers = callback => {
  User.find(callback);
}



// Function for adding user
module.exports.addUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.findUserByEmail = (email, callback) => {
  User.findOne({"email": email}, callback);
}

//Function for comoparing passwords
module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.changePassword = (id, newPassword, callback) => {
  User.findByIdAndUpdate(id, { $set: {
      password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10), null)}
      },{new: true}, callback);
}

