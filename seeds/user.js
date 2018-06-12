const mongoose = require('mongoose');
const User = require('../models/user');
const config = require("../config/database");



mongoose.connect(config.database);
mongoose.connection.on("connected", () => {
  console.log("Connected to database!");
});
// Filling the user object with superadmin values
var newUser = new User({
    firstName: "Prishtina municipality",
    lastName: "staff",
    email: "staff@prinshtina.com",
    gender: "male",
    password: "superadmin",
    role: "superadmin"
});

// Checking if user exists, if not create and save the user in database
User.findUserByEmail(newUser.email, (err, user) => {
    if(err) {
        console.log("Something went wrong while seeding!");
        process.exit();
    } else if (user) {
        console.log("The admin user is already in database!");
        process.exit();
    } else {
        newUser.save(err => {
            if (err) {
                console.log(err);
            } else {
                console.log("Admin user successfully saved!");
                process.exit();
            }
        });
    }
});

