const router = require("express").Router();
const Directorates  = require('../../models/directorates');
const passport = require("passport");
const directorateValidation = require("../../middlewares/directorate_validation");
const Users = require("../../models/user");
/*
 * ENDPOINTS PREFIX: /directorates
 */

//Route for creating a directorate
router.post('/',  directorateValidation, (req, res) => {
    let directorate = new Directorates({
        directorateName: req.body.directorateName,
        peopleInChargeEmails : req.body.peopleInChargeEmails,
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

// Route for getting all directorates and their person in charge
router.get('/', (req, res) => {
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
                "success": false
            });
        }
    });
});

// Route for getting directorate by id
router.get('/:id', (req,res) => {
    Directorates.getDirectorateById(req.params.id , (err, directorate) => {
        if(!err) {
            res.json({
                "msg": "Directorate has been retrived successfully",
                "directorate": directorate,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": false
            })
        }
    })
});

//Route for getting active directorates
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

//Route for getting directorates by their person in charge email
router.get('/user/:email', (req, res) => {
    Directorates.getDirectorateByEmail(req.params.email ,(err, directorate) => {
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

//Route for editing directorate
router.put('/edit-directorate/:id', (req,res) => {

    Directorates.updateDirectorate(req.params.id, req.body, (err, directorate) => {
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

//Route for deactivating directorate
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

//Route for activating directorate
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