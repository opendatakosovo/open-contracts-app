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
router.put('/edit-directorate/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
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
router.put('/deactivate-directorate/:id', (req,res) => {
    const directorateID = req.params.id;

    Directorates.deactivateDirectorate(directorateID , req.body, (err, directorate) => {
        if(!err) {
            res.json({
                "msg": "Directorate has been deactivated succesfully", 
                "directorate": directorate,
                "success": true
            })
        } else {
            res.json ({
                "err": err, 
                "success": false
            });
        }
    });
});

router.put('/activate-directorate/:id', (req,res) => {
    const directorateID = req.params.id;

    Directorates.activateDirectorate(directorateID , req.body, (err, directorate) => {
        if(!err) {
            res.json({
                "msg": "Directorate has been activated succesfully", 
                "directorate": directorate,
                "success": true
            })
        } else {
            res.json ({
                "err": err, 
                "success": false
            });
        }
    });
});

module.exports = router;