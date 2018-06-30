const mongoose = require('mongoose');

const ContractSchema = mongoose.Schema({
    activityTitle: { type: String },
    procurementNo: { type: Number },
    procurementType: { type: Number },
    procurementValue: { type: Number },
    procurementProcedure: { type: Number },
    fppClassification: { type: Number },
    planned: { type: Number },
    budget: { type: Number },
    initiationDate: { type: Date },
    approvalDateOfFunds: { type: Date },
    torDate: { type: Date },
    contractPublicationDate: { type: Date },
    complaintsToAuthority1: { type: Number },
    complaintsToOshp1: { type: Number },
    bidOpeningDateTime: { type: Date },
    contractNoOfDownloads: { type: Number },
    contractNoOfOffers: { type: Number },
    noOfOffersForContract: { type: Number },
    startingOfEvaluationDate: { type: Date },
    endingOfEvaluationDate: { type: Date },
    noOfRefusedBids: { type: Number },
    reapprovalDate: { type: Date },
    standardeDocumentsForOe: { type: Date },
    publicationDateOfGivenContract: { type: Date },
    cancellationNoticeDate: { type: Date },
    complaintsToAuthority2: { type: Number },
    complaintsToOshp2: { type: Number },
    predictedContractValue: { type: Number },
    oeType: { type: Number },
    applicationDeadlineType: { type: Number },
    contractCriteria: { type: Number },
    retender: { type: String },
    status: { type: Number },
    nameOfContractedOe: { type: String },
    signingDate: { type: Date },
    contractImplementationDeadline: { type: String },
    contractClosingDate: { type: Date },
    noOfPaymentInstallments: { type: Date },
    totalAmountOfAllAnnexContractsIncludingTaxes: { type: String },
    annexes: [{
        totalValueOfAnnexContract1: { type: String },
        annexContractSigningDate1: { type: Date }
    }],
    installments: [{
        installmentPayDate1: { type: Date },
        installmentAmount1: { type: String }
    }],
    lastInstallmendPayDate: { type: Date },
    lastInstallmendAmount: { type: String },
    discountAmount: { type: String },
    totalAmount: { type: String },
    department: { type: String },
    contractFile: { type: String },
    nameOfProdcurementOffical: { type: String },
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = (contract, cb) => {
    contract.save(cb);
}

module.exports.getAllContracts = cb => Contract.find().exec(cb);

module.exports.getContractById = (id, cb) => {
    Contract.findById(id, cb);
}