const router = require('express').Router();
const passport = require('passport');
const Contract = require('../../models/contracts');

router.post("/", (req, res) => {
    const contract = new Contract({
        activityTitle: req.body.contract.activityTitle,
        procurementNo: req.body.contract.procurementNo,
        procurementType: req.body.contract.procurementType,
        procurementValue: req.body.contract.procurementValue,
        procurementProcedure: req.body.contract.procurementProcedure,
        fppClassification: req.body.contract.fppClassification,
        planned: req.body.contract.planned,
        budget: req.body.contract.budget,
        initiationDate: req.body.contract.initiationDate,
        approvalDateOfFunds: req.body.contract.approvalDateOfFunds,
        torDate: req.body.contract.torDate,
        contractPublicationDate: req.body.contract.contractPublicationDate,
        complaintsToAuthority1: req.body.contract.complaintsToAuthority1,
        complaintsToOshp1: req.body.contract.complaintsToOshp1,
        bidOpeningDateTime: req.body.contract.bidOpeningDateTime,
        contractNoOfDownloads: req.body.contract.contractNoOfDownloads,
        contractNoOfOffers: req.body.contract.contractNoOfOffers,
        noOfOffersForContract: req.body.contract.noOfOffersForContract,
        startingOfEvaluationDate: req.body.contract.startingOfEvaluationDate,
        endingOfEvaluationDate: req.body.contract.endingOfEvaluationDate,
        noOfRefusedBids: req.body.contract.noOfRefusedBids,
        reapprovalDate: req.body.contract.reapprovalDate,
        standardeDocumentsForOe: req.body.contract.standardeDocumentsForOe,
        publicationDateOfGivenContract: req.body.contract.publicationDateOfGivenContract,
        cancellationNoticeDate: req.body.contract.cancellationNoticeDate,
        complaintsToAuthority2: req.body.contract.complaintsToAuthority2,
        complaintsToOshp2: req.body.contract.complaintsToOshp2,
        predictedContractValue: req.body.contract.predictedContractValue,
        oeType: req.body.contract.oeType,
        applicationDeadlineType: req.body.contract.applicationDeadlineType,
        contractCriteria: req.body.contract.contractCriteria,
        retender: req.body.contract.retender,
        status: req.body.contract.status,
        nameOfContractedOe: req.body.contract.nameOfContractedOe,
        signingDate: req.body.contract.signingDate,
        contractImplementationDeadline: req.body.contract.contractImplementationDeadline,
        contractClosingDate: req.body.contract.contractClosingDate,
        noOfPaymentInstallments: req.body.contract.noOfPaymentInstallments,
        totalAmountOfAllAnnexContractsIncludingTaxes: req.body.contract.totalAmountOfAllAnnexContractsIncludingTaxes,
        annexes: req.body.contract.annexes,
        installments: req.body.contract.installments,
        lastInstallmendPayDate: req.body.contract.lastInstallmendPayDate,
        lastInstallmendAmount: req.body.contract.lastInstallmendAmount,
        discountAmount: req.body.contract.discountAmount,
        totalAmount: req.body.contract.totalAmount,
        department: req.body.contract.department,
        contractFile: req.body.contract.contractFile,
        nameOfProdcurementOffical: req.body.contract.nameOfProdcurementOffical
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