const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const ContractSchema = mongoose.Schema({
    activityTitle: { type: String },
    procurementNo: { type: Number },
    procurementType: { type: Number },
    procurementValue: { type: Number },
    procurementProcedure: { type: Number },
    fppClassification: { type: Number },
    planned: { type: String },
    budget: [{ type: String }],
    initiationDate: { type: Date },
    approvalDateOfFunds: { type: Date },
    torDate: { type: Date },
    complaintsToAuthority1: { type: String },
    complaintsToOshp1: { type: String },
    bidOpeningDate: { type: Date },
    noOfCompaniesWhoDownloadedTenderDoc: { type: Number },
    noOfCompaniesWhoSubmited: { type: Number },
    startingOfEvaluationDate: { type: Date },
    endingOfEvaluationDate: { type: Date },
    startingAndEndingEvaluationDate: { type: String },
    noOfRefusedBids: { type: Number },
    reapprovalDate: { type: Date },
    publicationDateOfGivenContract: { type: Date },
    cancellationNoticeDate: { type: Date },
    complaintsToAuthority2: { type: String },
    complaintsToOshp2: { type: String },
    applicationDeadlineType: { type: String },
    retender: { type: String },
    status: { type: String },
    noOfPaymentInstallments: { type: Number },
    installments: [{
        installmentPayDate1: { type: Date },
        installmentAmount1: { type: Number }
    }],
    lastInstallmentPayDate: { type: Date },
    lastInstallmentAmount: { type: Number },
    discountAmount: { type: String },
    directorates: { type: mongoose.Schema.Types.ObjectId },
    nameOfProcurementOffical: { type: String },
    contract: {
        predictedValue: { type: Number },
        totalAmountOfAllAnnexContractsIncludingTaxes: { type: Number },
        totalAmountOfContractsIncludingTaxes: { type: Number },
        totalPayedPriceForContract: { type: Number },
        annexes: [{
            totalValueOfAnnexContract1: { type: Number },
            annexContractSigningDate1: { type: Date }
        }],
        criteria: { type: String },
        implementationDeadlineStartingDate: { type: Date },
        implementationDeadlineEndingDate: { type: Date },
        implementationDeadlineStartingAndEndingDate: { type: String },
        publicationDate: { type: Date },
        publicationDateOfGivenContract: { type: Date },
        closingDate: { type: Date },
        discountAmount: { type: Number },
        file: { type: String },
        signingDate: { type: Date },
    },
    company: {
        name: { type: String },
        slug: { type: String },
        headquarters: {
            name: { type: String },
            slug: { type: String }
        },
        type: { type: String },
        standardDocuments: {
            type: Date
        },
    },
    year: { type: Number },
    flagStatus: { type: Number }

});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = (contract, cb) => {
    contract.save(cb);
}

module.exports.getAllContracts = cb => Contract.find().exec(cb);

module.exports.getContractById = (id, cb) => {
    Contract.findById(id, cb);
}