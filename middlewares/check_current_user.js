const User = require("../models/user");

module.exports = (req, res, next) => {
  User.findUserByEmail(
    req.body.email,
    (err, user) => {
      if (!err) {
         if(user) {
          if(user.isActive == false){
            res.json({
              usr_err: "User is inactive",
              success: false
            });
           }
          else {
            next();
          }
         } else { 
           next();
         }
      } else {
        res.json(err);
      }
    }
  );
};
