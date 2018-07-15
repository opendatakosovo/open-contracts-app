const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const ContractSchema = mongoose.Schema({
    activityTitle: { type: String },
    procurementNo: { type: Number },
    procurementType: { type: String },
    procurementValue: { type: String },
    procurementProcedure: { type: String },
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
    lastInstallmentAmount: { type: String },
    discountAmount: { type: String },
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
    directorates: { type: String },
    nameOfProcurementOffical: { type: String },
    contract: {
        predictedValue: { type: String },
        totalAmountOfAllAnnexContractsIncludingTaxes: { type: String },
        totalAmountOfContractsIncludingTaxes: { type: String },
        totalPayedPriceForContract: { type: String },
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
        discountAmount: { type: String },
        file: { type: String },
        signingDate: { type: Date },
    },
    year: { type: Number },
    flagStatus: 0,
    fppClassification: { type: Number }
});

const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = (contract, cb) => {
    contract.save(cb);
}

module.exports.getAllContracts = cb => Contract.find().exec(cb);

module.exports.getContractById = (id, cb) => {
    Contract.findById(id, cb);
}

module.exports.deleteContractById = (id, callback) => {
    Contract.findByIdAndRemove(id, callback);
}

module.exports.updateContract = (id, contract, callback) => {
    Contract.findByIdAndUpdate(id, { $set: contract }, { new: true }, callback);
}

// Function for finding 2018 contracts
module.exports.latestContracts = (callback) => {
    Contract.find({ "year": 2018 }, callback);
}
// Data Visualizations

module.exports.getContractsByYearWithPublicationDateAndSigningDate = (year) => {
    return Contract.aggregate([
        {
            $match: {
                $or: [{
                    year: parseInt(year)
                }]
            }
        },
        { $group: { _id: { publicationDateOfGivenContract: "$contract.publicationDateOfGivenContract", signingDate: "$contract.signingDate" }, count: { $sum: 1 } } },
        { $project: { _id: 0, publicationDateOfGivenContract: "$_id.publicationDateOfGivenContract", signingDate: "$_id.signingDate", totalContracts: "$count" } }
    ]);
}

module.exports.getTotalContractsByYears = () => {
    return Contract.aggregate([
        { $group: { _id: "$year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, year: "$_id", totalContracts: "$count" } }
    ]);
}

module.exports.getContractsByYearWithPredictedValueAndTotalAmount = (year) => {
    return Contract.aggregate([
        { $match: { year: parseInt(year) } },
        { $group: { _id: { id: "$_id", procurementNo: "$procurementNo", predictedValue: "$contract.predictedValue", totalAmountOfContractsIncludingTaxes: "$contract.totalAmountOfContractsIncludingTaxes" } } },
        { $project: { _id: 0, id: "$_id.id", procurementNo: "$_id.procurementNo", predictedValue: "$_id.predictedValue", totalAmountOfContractsIncludingTaxes: "$_id.totalAmountOfContractsIncludingTaxes", } },
        { $sort: { predictedValue: -1 } }
    ]);
}

module.exports.getTopTenContractors = () => {
    return Contract.aggregate([
        { $match: { "company.name": { "$ne": "" } } },
        {
            $group: { _id: "$company.name", count: { $sum: 1 } }
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, companyName: "$_id", totalContracts: "$count" } }
    ]);
}

module.exports.getContractsByContractorCompany = (companyName) => {
    return Contract.find({ "company.name": companyName });
}