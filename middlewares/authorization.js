// A middleware function that will take string values parameters
module.exports = (...allowed) => {
    // A function will take as parameter the authenticated user role
    // and will check if user role is match with one of the role 
    // passed in this function as ...allowed parameter
    const isAllowed = role => allowed.indexOf(role) > -1;

    const redirectBasedOnRole = (res) => {
        res.json({
            "msg": "Operation not allowed",
            "succes": false
        })
    }

    // Checking if user exists and if role is matched
    // continue to next middleware
    // if not redirect to their profiles 
    return (req, res, next) => {
        if (req.user && isAllowed(req.user.role)) {
            next();
        } else {
            redirectBasedOnRole(res);
        }
    }
}



