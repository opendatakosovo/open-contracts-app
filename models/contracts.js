const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const schemaOptions = {
    timestamps: true,
    versionKey: false
};

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
            totalValueOfAnnexContract1: { type: String },
            annexContractSigningDate1: { type: Date }
        }],
        criteria: { type: String },
        implementationDeadline: { type: String },
        publicationDate: { type: Date },
        publicationDateOfGivenContract: { type: Date },
        closingDate: { type: Date },
        discountAmountFromContract: { type: String },
        file: { type: String },
        signingDate: { type: Date },
    },
    year: { type: Number },
    flagStatus: { type: Number, default: 1 },
    fppClassification: { type: Number }
}, schemaOptions);


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

module.exports.countContracts = () => {
    return Contract.count();
}

module.exports.countLatestContracts = () => {
    return Contract.find({ "year": 2018 }).count();
}


// Data Visualizations

module.exports.getContractsByYearWithPublicationDateAndSigningDate = (year) => {
    return Contract.aggregate([
        {
            $match: {
                $or: [{
                    year: parseInt(year)
                }],
                "contract.signingDate": { $ne: null },
                "contract.publicationDateOfGivenContract": { $ne: null },
            }
        },
        { $group: { _id: { publicationDateOfGivenContract: "$contract.publicationDateOfGivenContract", signingDate: "$contract.signingDate", activityTitle: '$activityTitle' }, count: { $sum: 1 } } },
        { $project: { _id: 0, publicationDateOfGivenContract: "$_id.publicationDateOfGivenContract", signingDate: "$_id.signingDate", totalContracts: "$count", activityTitle: '$_id.activityTitle' } }
    ]);
}

module.exports.getTotalContractsByYears = () => {
    return Contract.aggregate([
        { $group: { _id: "$year", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: "$_id", y: "$count" } }
    ]);
}

module.exports.getContractsByYearWithPredictedValueAndTotalAmount = (year) => {
    return Contract.aggregate([
        {
            $match: {
                year: parseInt(year),
                'contract.predictedValue': { $nin: ["", null] },
                'contract.totalAmountOfContractsIncludingTaxes': { $nin: ["", null] },
            }
        },
        { $group: { _id: { id: "$_id", activityTitle: "$activityTitle", predictedValue: "$contract.predictedValue", totalAmountOfContractsIncludingTaxes: "$contract.totalAmountOfContractsIncludingTaxes" } } },
        { $project: { _id: 0, id: "$_id.id", activityTitle: "$_id.activityTitle", predictedValue: "$_id.predictedValue", totalAmountOfContractsIncludingTaxes: "$_id.totalAmountOfContractsIncludingTaxes" } },
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
        { $project: { _id: 0, name: "$_id", y: "$count" } }
    ]);
}

module.exports.getContractsByContractorCompany = (companyName) => {
    return Contract.find({ "company.name": companyName });
}

module.exports.getContractsByYears = year => {
    return Contract.find({ year: Number(year) });
}

module.exports.getDirectoratesInContracts = () => {
    return Contract.aggregate([
        { $group: { _id: "$directorates", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, name: "$_id", y: "$count" } }
    ]);
}

module.exports.getContractYears = () => {
    return Contract.aggregate([{
        $match: {
            year: { $gt: 2017 }
        }
    },
    { $group: { _id: { year: '$year' } } },
    { $project: { _id: 0, year: '$_id.year' } }]);
}


/** Dashboard Data **/
// Get total contracts by flag status
module.exports.getTotalContractsbyFlagStatus = flagStatus => Contract.find({ flagStatus: flagStatus }).count();

// Get total contracts
module.exports.getTotalContracts = () => Contract.find().count();

// Filter functions
module.exports.filterStringFieldsinContracts = (text, callback) => {
    Contract.find({
        "$or": [
            { "activityTitle": { "$regex": text } },
            { "contract.implementationDeadline": { "$regex": text } },
            { "company.name": { "$regex": text } }
        ]
    }, callback);
}

module.exports.findByDirectorate = (directorate, callback) => {
    Contract.find({
        "directorates": directorate
    }, callback);
}

module.exports.findByDate = (date, referenceDate, callback) => {
    Contract.find({
        "$or": [
            {
                "contract.publicationDate":
                    {
                        "$gte": date,
                        "$lt": referenceDate
                    }
            },
            {
                "contract.publicationDateOfGivenContract":
                    {
                        "$gte": date,
                        "$lt": referenceDate
                    }
            },
            {
                "contract.signingDate":
                    {
                        "$gte": date,
                        "$lt": referenceDate
                    }
            },
            {
                "cancellationNoticeDate":
                    {
                        "$gte": date,
                        "$lt": referenceDate
                    }
            }
        ]
    }, callback);
}

module.exports.findContractByValues = (value, callback) => {
    Contract.find({
        "$or": [
            { "contract.predictedValue": { "$regex": value } },
            { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
        ]
    }, callback);
}

module.exports.findByStringAndDirectorate = (text, directorate, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } }
                ]
            },
            { "directorates": directorate }
            ]
    }, callback);
}

module.exports.findbyStringDirectorateDate = (text, directorate, date, referenceDate, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } }
                ]
            },
            { "directorates": directorate },
            {
                "$or": [
                    {
                        "contract.publicationDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.publicationDateOfGivenContract":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.signingDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "cancellationNoticeDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    }
                ]
            }]
    }, callback);
}

module.exports.findbyStringDirectorateDateValue = (text, directorate, date, referenceDate, value, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } }
                ]
            },
            { "directorates": directorate },
            {
                "$or": [
                    {
                        "contract.publicationDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.publicationDateOfGivenContract":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.signingDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "cancellationNoticeDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    }
                ]
            },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            }
            ]
    }, callback);
}
module.exports.findByStringDate = (text, date, referenceDate, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } },
                ]
            },
            {
                "$or": [
                    {
                        "contract.publicationDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.publicationDateOfGivenContract":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.signingDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "cancellationNoticeDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    }
                ]
            }
            ]
    }, callback);
}

module.exports.findbyStringValue = (text, value, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } },
                ]
            },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            }
            ]
    }, callback);
}

module.exports.findbyDirectorateDate = (directorate, date, referenceDate, callback) => {
    Contract.find({
        "$and":
            [
                { "directorates": directorate },
                {
                    "$or": [
                        {
                            "contract.publicationDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.publicationDateOfGivenContract":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.signingDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "cancellationNoticeDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        }
                    ]
                }
            ]
    }, callback);
}

module.exports.findbyDirectorateValue = (directorate, value, callback) => {
    Contract.find({
        "$and":
            [
                { "directorates": directorate },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                }
            ]
    }, callback);
}

module.exports.findbyDateValue = (date, referenceDate, value, callback) => {
    Contract.find({
        "$and":
            [
                {
                    "$or": [
                        {
                            "contract.publicationDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.publicationDateOfGivenContract":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.signingDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "cancellationNoticeDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                }
            ]
    }, callback);
}
module.exports.findbyDirectorateDateValue = (directorate, date, referenceDate, value, callback) => {
    Contract.find({
        "$and":
            [
                { "directorates": directorate },
                {
                    "$or": [
                        {
                            "contract.publicationDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.publicationDateOfGivenContract":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "contract.signingDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        },
                        {
                            "cancellationNoticeDate":
                                {
                                    "$gte": date,
                                    "$lt": referenceDate
                                }
                        }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                }
            ]
    }, callback);
}

module.exports.findbyStringDate = (text, date, referenceDate, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "regex": text } },
                    { "company.name": { "$regex": text } }
                ]
            },
            {
                "$or": [
                    {
                        "contract.publicationDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.publicationDateOfGivenContract":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "contract.signingDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    },
                    {
                        "cancellationNoticeDate":
                            {
                                "$gte": date,
                                "$lt": referenceDate
                            }
                    }
                ]
            }

            ]
    }, callback);
}

module.exports.findbyStringDirectorateValue = (text, directorate, value, callback) => {
    Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitle": { "$regex": text } },
                    { "contract.implementationDeadline": { "$regex": text } },
                    { "company.name": { "$regex": text } },
                ]
            },
            { "directorates": directorate },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            }
            ]
    }, callback);
}
