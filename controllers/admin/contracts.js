const router = require('express').Router();
const passport = require('passport');
const Contract = require('../../models/contracts');
const fs = require("fs");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post("/", passport.authenticate('jwt', { session: false }), upload.single("file"), (req, res) => {
    const requestedContract = JSON.parse(req.body.contract);
    const contract = new Contract({
        activityTitle: requestedContract.activityTitle,
        procurementNo: requestedContract.procurementNo,
        procurementType: requestedContract.procurementType,
        procurementValue: requestedContract.procurementValue,
        procurementProcedure: requestedContract.procurementProcedure,
        fppClassification: requestedContract.fppClassification,
        planned: requestedContract.planned,
        budget: requestedContract.budget,
        initiationDate: requestedContract.initiationDate,
        approvalDateOfFunds: requestedContract.approvalDateOfFunds,
        torDate: requestedContract.torDate,
        contractPublicationDate: requestedContract.contractPublicationDate,
        complaintsToAuthority1: requestedContract.complaintsToAuthority1,
        complaintsToOshp1: requestedContract.complaintsToOshp1,
        bidOpeningDateTime: requestedContract.bidOpeningDateTime,
        contractNoOfDownloads: requestedContract.contractNoOfDownloads,
        contractNoOfOffers: requestedContract.contractNoOfOffers,
        noOfOffersForContract: requestedContract.noOfOffersForContract,
        startingOfEvaluationDate: requestedContract.startingOfEvaluationDate,
        endingOfEvaluationDate: requestedContract.endingOfEvaluationDate,
        noOfRefusedBids: requestedContract.noOfRefusedBids,
        reapprovalDate: requestedContract.reapprovalDate,
        standardeDocumentsForOe: requestedContract.standardeDocumentsForOe,
        publicationDateOfGivenContract: requestedContract.publicationDateOfGivenContract,
        cancellationNoticeDate: requestedContract.cancellationNoticeDate,
        complaintsToAuthority2: requestedContract.complaintsToAuthority2,
        complaintsToOshp2: requestedContract.complaintsToOshp2,
        predictedContractValue: requestedContract.predictedContractValue,
        oeType: requestedContract.oeType,
        applicationDeadlineType: requestedContract.applicationDeadlineType,
        contractCriteria: requestedContract.contractCriteria,
        retender: requestedContract.retender,
        status: requestedContract.status,
        nameOfContractedOe: requestedContract.nameOfContractedOe,
        signingDate: requestedContract.signingDate,
        contractImplementationDeadline: requestedContract.contractImplementationDeadline,
        contractClosingDate: requestedContract.contractClosingDate,
        noOfPaymentInstallments: requestedContract.noOfPaymentInstallments,
        totalAmountOfAllAnnexContractsIncludingTaxes: requestedContract.totalAmountOfAllAnnexContractsIncludingTaxes,
        annexes: requestedContract.annexes,
        installments: requestedContract.installments,
        lastInstallmendPayDate: requestedContract.lastInstallmendPayDate,
        lastInstallmendAmount: requestedContract.lastInstallmendAmount,
        discountAmount: requestedContract.discountAmount,
        totalAmount: requestedContract.totalAmount,
        department: requestedContract.department,
        contractFile: req.file.originalname,
        nameOfProdcurementOffical: requestedContract.nameOfProdcurementOffical
    });

    Contract.addContract(contract, (err, contract) => {
        if (!err) {
            res.json({
                "msg": "Contract has been added successfully",
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