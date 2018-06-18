const router = require("express").Router();
const Directorates  = require('../../models/directorates');

//Route for creating a user
router.post('/', (req, res) => {
    let directorate = new Directorates({
        name: req.body.name,
    });
   
    Directorates.findDirectorate (directorate.name, (err, directorateExists) => {
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

module.exports = router;