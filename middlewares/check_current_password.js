const User = require("../models/user");

module.exports = (req, res, next) => {
  User.comparePassword(
    req.body.currentPassword,
    req.user.password,
    (err, isMatch) => {
      if (!err) {
        if (isMatch) {
          next();
        } else {
          res.json({

            pwd_err: "Your password is incorrect",
            success: false
          });
        }
      } else {
        res.json(err);
      }
    }
  );
};
