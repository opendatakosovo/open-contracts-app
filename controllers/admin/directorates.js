const router = require("express").Router();
const Directorates  = require('../../models/directorates');
const passport = require("passport");
const directorateValidation = require("../../middlewares/directorate_validation");
/*
 * ENDPOINTS PREFIX: /directorates
 */

//Route for creating a user
router.post('/', passport.authenticate('jwt', {session: false}), directorateValidation, (req, res) => {
    let directorate = new Directorates({
        directorateName: req.body.directorateName,
        thePersonInCharge: req.body.thePersonInCharge, 
        isActive: req.body.isActive
    });
   
    Directorates.findDirectorate (directorate.directorateName, (err, directorateExists) => {
        if(!err){
            if(directorateExists) {
                res.json({
                    "msg": "This directorate exists",
                    "exists": true
                });
            } else {
                Directorates.addDirectorate(directorate, (err, directorate)=> {
                    if(!err){
                        res.json({
                            "msg": "Directorate has been added succesfully!",
                            "directorate": directorate , 
                            "success" : true
                        });
                    } else {
                        res.json({
                            "err": err,
                            "success": false
                        });
                    }
                });
            }
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
 
});

// Get all directorates 
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    Directorates.getAllDirectorates((err, directorates) => {
        if (!err) {
            res.json({
                "msg": "Directorate has been retrived successfully",
                "directorates": directorates,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Get directorate by id 
router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Directorates.getDirectorateById(req.params.id, (err, directorate) => {
        if (!err) {
            res.json({
                "msg": "Directorate by id has been retrived successfully",
                "directorate": directorate,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});
router.put('/edit-directorate/:id', (req,res) => {
    const directorateId = req.params.id;

    Directorates.updateDirectorate(directorateId, req.body, (err, directorate) => {
        if(!err) {
            res.json({
                "msg": "Directorate has been updated successfully",
                "directorate": directorate, 
                "success": true
            });
        } else {
            res.json({
                "err": err, 
                "success": false
            });
        }
    });
});
module.exports = router;