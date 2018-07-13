const router = require('express').Router();
const passport = require('passport');
const upload = require('../../utils/storage');
const Contract = require('../../models/contracts');
const contractValidation = require("../../middlewares/contract_validation");

/*
 * ENDPOINTS PREFIX: /contracts
 */

router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Contract.getAllContracts((err, contracts) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "data": contracts,
                "success": true
            });
        }
    });
});

router.post("/", passport.authenticate('jwt', { session: false }), upload.single("file"),(req, res) => {
    const requestedContract = JSON.parse(req.body.contract);
    const contract = new Contract({
        activityTitle: requestedContract.activityTitle,
        procurementNo: requestedContract.procurementNo,
        procurementType: requestedContract.procurementType,
        procurementValue: requestedContract.procurementValue,
        procurementProcedure: requestedContract.procurementProcedure,
        planned: requestedContract.planned,
        budget: requestedContract.budget,
        initiationDate: requestedContract.initiationDate,
        approvalDateOfFunds: requestedContract.approvalDateOfFunds,
        torDate: requestedContract.torDate,
        complaintsToAuthority1: requestedContract.complaintsToAuthority1,
        complaintsToOshp1: requestedContract.complaintsToOshp1,
        bidOpeningDate: requestedContract.bidOpeningDate,
        noOfCompaniesWhoDownloadedTenderDoc: requestedContract.noOfCompaniesWhoDownloadedTenderDoc, 
        noOfCompaniesWhoSubmited: requestedContract.noOfCompaniesWhoSubmited,
        startingOfEvaluationDate: requestedContract.startingOfEvaluationDate, 
        endingOfEvaluationDate: requestedContract.endingOfEvaluationDate,
        startingAndEndingEvaluationDate: requestedContract.startingAndEndingEvaluationDate,
        noOfRefusedBids: requestedContract.noOfRefusedBids,  
        reapprovalDate: requestedContract.reapprovalDate, 
        publicationDateOfGivenContract: requestedContract.publicationDateOfGivenContract,
        cancellationNoticeDate: requestedContract.cancellationNoticeDate, 
        complaintsToAuthority2: requestedContract.complaintsToAuthority2,
        complaintsToOshp2: requestedContract.complaintsToOshp2,
        applicationDeadlineType: requestedContract.applicationDeadlineType, 
        retender: requestedContract.retender,   
        status: requestedContract.status,
        noOfPaymentInstallments: requestedContract.noOfPaymentInstallments, 
        installments: requestedContract.installments,     
        lastInstallmendPayDate: requestedContract.lastInstallmendPayDate,
        lastInstallmendAmount: requestedContract.lastInstallmendAmount, 
        discountAmount: requestedContract.discountAmount,
        company: requestedContract.company,  
        directorates: requestedContract.directorates,
        nameOfProdcurementOffical: requestedContract.nameOfProdcurementOffical,
        contract: requestedContract.contract,                                       
        year: requestedContract.year,
        flagStatus: requestedContract.flagStatus,
        fppClassification: requestedContract.fppClassification
    });
   contract.contract.file = req.file.originalname;
    Contract.addContract(contract, (err, contract) => {
        if (!err) {
            res.json({
                "msg": "Contract has been added successfully",
                "contract": contract,
                "success": true
            });
        } else {
            res.json({
                "msg": "test",
                "err": err,
                "success": false
            });
        }
    });
});

router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Contract.getContractById(req.params.id, (err, contract) => {
        if (err) {
            res.json({
                "err": err,
                "success": false
            });
        } else {
            res.json({
                "data": contract,
                "success": true,
            });
        }
    });
});

// Route for deleting a contract by id
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Contract.deleteContractById(req.params.id, (err, contract) => {
        if (!err) {
            res.json({
                "msg": "Contract has been deleted successfully",
                "contract": contract,
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

// Router for updating a contract by id
router.put('/edit-contract/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const contractId = req.params.id;

    Contract.updateContract(contractId, req.body, (err, contract) => {
        if (!err) {
            res.json({
                "msg": "Contract has been updated successfully",
                "contract": contract,
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