const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const ContractSchema = mongoose.Schema({
    activityTitle: { type: String },
    procurementNo: { type: Number },
    procurementType: { type: String },
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
    bidOpeningDateTime: { type: Date },
    NoOfCompaniesWhoDownloadedTenderDoc: { type: Number },
    NoOfCompaniesWhoSubmited: { type: Number },
    startingOfEvaluationDate: { type: Date },
    endingOfEvaluationDate: { type: Date },
    noOfRefusedBids: { type: Number },
    reapprovalDate: { type: Date },
    publicationDateOfGivenContract: { type: Date },
    cancellationNoticeDate: { type: Date },
    complaintsToAuthority2: { type: String },
    complaintsToOshp2: { type: String },
    applicationDeadlineType: { type: String },
    retender: { type: String },
    status: { type: String },
    signingDate: { type: Date },
    noOfPaymentInstallments: { type: Number },
    installments: [{
        installmentPayDate1: { type: Date },
        installmentAmount1: { type: String }
    }],
    lastInstallmendPayDate: { type: Date },
    lastInstallmendAmount: { type: String },
    discountAmount: { type: String },
    totalAmount: { type: String },
    directorates: { type: Schema.Types.ObjectId },
    nameOfProcurementOffical: { type: String },
    contract: {
        predictedValue: { type: Number },
        totalAmountOfAllAnnexContractsIncludingTaxes: { type: Number },
        price: { type: Number },
        annexes: [{
            totalValueOfAnnexContract1: { type: String },
            annexContractSigningDate1: { type: Date }
        }],
        deadlineType: { type: Number },
        criteria: { type: String },
        implementationDeadlineStartingDate: { type: Date },
        ImplementationDeadlineEndingDate: { type: Date },
        publicationDate: { type: Date },
        publicationDateOfGivenContract: { type: Date },
        closingDate: { type: Date },
        discountAmountFromContract: { type: Number },
        file: { type: String }
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
            type: String
        },
        year: { type: Number },
        flagStatus: { type: Number }
    }
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = (contract, cb) => {
    contract.save(cb);
}

module.exports.getAllContracts = cb => Contract.find().exec(cb);

module.exports.getContractById = (id, cb) => {
    Contract.findById(id, cb);
}