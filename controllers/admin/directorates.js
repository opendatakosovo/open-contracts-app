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
        peopleInCharge : req.body.peopleInCharge,
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

//Route for adding people in charge 
router.post('/people-in-charge', (req,res) => {
    Directorates.addAndRemovePeopleInCharge(req.body.directorateName, req.body.peopleInCharge, (err,result) => {
        if(!err) {
            res.json({
                "msg": "Directorates has been updated successfully",
                "result": result,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": false
            })
        }
    });
});
//Method for counting directorates 
router.get('/count' , (req,res) => {
    Directorates.countDirectorates ((err, number) => {
        if(!err) {
            res.json({
                "msg": "The number of directorates has been retrived successfully",
                "number": number,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": false
            })
        }
    })
})

//Route for getting all directorates 
router.get('/', (req,res) => {
    Directorates.getAllDirectorates((err, directorates) => {
        if(!err) {
            res.json({
                "msg": "Directorates has been retrived successfully",
                "directorates": directorates,
                "success": true
            })
        } else {
            res.json({
                "err": err,
                "success": false
            })
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