const router = require("express").Router();
const Directorates  = require('../../models/directorates');
const passport = require("passport");
const directorateValidation = require("../../middlewares/directorate_validation");
const Users = require("../../models/user");
/*
 * ENDPOINTS PREFIX: /directorates
 */

//Route for creating a directorate
router.post('/', passport.authenticate('jwt', {session: false}), directorateValidation, (req, res) => {
    let directorate = new Directorates({
        directorateName: req.body.directorateName,
        thePersonInChargeEmail : req.body.thePersonInChargeEmail,
        directorateIsActive: req.body.directorateIsActive
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
router.get('/', (req, res) => {
    Directorates.getAllDirectorates((err, directorates) => {
        if (!err) {
            res.json({
                "msg": "Directorates has been retrived successfully",
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
router.get('/users', (req, res) => {
    Directorates.getAllDirectoratesWithPersonInCharge((err, result) => {
        if(!err) {
            res.json ({
                "msg": "Data has been retrived successfully",
                "result": result,
                "succes": true
            });
        } else {
            res.json({
                "err": err,
                "success": true
            });
        }
    });
});

router.get('/active-directorates', (req, res) => {
    Directorates.activeDirectorates((err, directorates) => {
        if(!err) {
            res.json({
                "msg": "Active users has been retrived succesfully",
                "directorates": directorates, 
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": true
            });
        }
    });
});
// Get directorate by id 
router.get('/:email', (req, res) => {
    const email = req.body.thePersonInChargeEmail;

    Directorates.getDirectorateByEmail(email ,(err, directorate) => {
        if(!err) {
            res.json ({
                "msg": "Directorate has been retrived successfully",
                "directorate": directorate,
                "succes": true
            });
        } else {
            res.json({
                "err": err,
                "success": true
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