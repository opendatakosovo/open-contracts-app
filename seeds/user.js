const mongoose = require('mongoose');
const User = require('../models/user');


// Loading Configuration
require('dotenv').config();

// Connecting to database
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`)
    .then(() => {
        console.log("Connected to database");
    }).catch(err => {
        console.log("Error while database connection: " + err);
    });
// Filling the user object with superadmin values
var newUser = new User({
    firstName: "Prishtina municipality",
    lastName: "staff",
    email: "staff@prishtina.com",
    gender: "male",
    password: "superadmin",
    role: "superadmin",
    isActive: true
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

