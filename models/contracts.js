const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const schemaOptions = {
    timestamps: true,
    versionKey: false
};

const ContractSchema = mongoose.Schema({
    activityTitle: { type: String },
    activityTitleSlug: { type: String },
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
    directoratesSlug: { type: String },
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
        implementationDeadlineSlug: { type: String },
        publicationDate: { type: Date },
        publicationDateOfGivenContract: { type: Date },
        closingDate: { type: Date },
        discountAmountFromContract: { type: String },
        file: { type: String },
        signingDate: { type: Date },
    },
    year: { type: Number },
    flagStatus: { type: String, default: '1' },
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
            $match: year == "any" ? {
                "contract.signingDate": { $ne: null },
                "contract.publicationDateOfGivenContract": { $ne: null }
            } : {
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
            $match: year == "any" ? {
                'contract.predictedValue': { $nin: ["", null] },
                'contract.totalAmountOfContractsIncludingTaxes': { $nin: ["", null] },
            } : {
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

module.exports.getContractsByContractorCompany = companyName => {
    return Contract.find({ "company.name": companyName });
}


module.exports.getContractsMostByTotalAmountOfContract = year => {
    return Contract.aggregate([
        {
            $match: year == "any" ? { "contract.totalAmountOfContractsIncludingTaxes": { $ne: '' } } : {
                year: parseInt(year),
                "contract.totalAmountOfContractsIncludingTaxes": { $ne: '' },
            }
        },
        {
            $group: {
                _id: {
                    procurementNo: '$procurementNo',
                    activityTitle: '$activityTitle',
                    companyName: '$company.name',
                    publicationDateOfGivenContract: "$contract.publicationDateOfGivenContract",
                    signingDate: "$contract.signingDate",
                    totalAmountOfContractsIncludingTaxes: "$contract.totalAmountOfContractsIncludingTaxes",
                    predictedValue: "$contract.predictedValue"
                }
            }
        },
        {
            $project: {
                _id: 0, activityTitle: '$_id.activityTitle',
                totalAmountOfContractsIncludingTaxes: "$_id.totalAmountOfContractsIncludingTaxes",
                predictedValue: "$_id.predictedValue",
                procurementNo: "$_id.procurementNo",
                companyName: "$_id.companyName",
                publicationDateOfGivenContract: "$_id.publicationDateOfGivenContract",
                signingDate: "$_id.signingDate"
            }
        }
    ]);
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

module.exports.getContractYears = (year = 2017) => {
    return Contract.aggregate([{
        $match: {
            year: { $gt: year == 2017 ? 2017 : year }
        }
    },
    { $sort: { year: 1 } },
    { $group: { _id: { year: '$year' } } },
    { $project: { _id: 0, year: '$_id.year' } }]);
}


/** Dashboard Data **/
// Get total contracts by flag status
module.exports.getTotalContractsbyFlagStatus = flagStatus => Contract.find({ flagStatus: flagStatus }).count();

// Get total contracts
module.exports.getTotalContracts = () => Contract.find().count();

// Filter functions
// Filter by any string field
module.exports.filterStringFieldsInContracts = (text) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterStringFieldsInContractsCount = (text) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    })
}

// Filter by directorate 
module.exports.filterByDirectorate = (directorate) => {
    return Contract.find({
        "$and":
            [
                { "year": new Date().getFullYear() },
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } }
            ]

    });
}

module.exports.filterByDirectorateCount = (directorate) => {
    return Contract.count({
        "$and":
            [
                { "year": new Date().getFullYear() },
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } }
            ]

    });
}

// Filter by date 
module.exports.filterByDate = (date, referenceDate) => {
    return Contract.find({
        "$and":
            [
                { "year": new Date().getFullYear() },
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
    });
}

module.exports.filterByDateCount = (date, referenceDate) => {
    return Contract.count({
        "$and":
            [
                { "year": new Date().getFullYear() },
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
    });
}

// Filter by value

module.exports.filterByValue = (value) => {
    return Contract.find({
        "$and":
            [
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterByValueCount = (value) => {
    return Contract.count({
        "$and":
            [
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string and directorate 

module.exports.filterByStringAndDirectorate = (text, directorate) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
            { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterByStringAndDirectorateCount = (text, directorate) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
            { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string, directorate, date
module.exports.filterbyStringDirectorateDate = (text, directorate, date, referenceDate) => {
    return Contract.find({
        "$and":
            [
                { "year": new Date().getFullYear() },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
    });
}
module.exports.filterbyStringDirectorateDateCount = (text, directorate, date, referenceDate) => {
    return Contract.count({
        "$and":
            [
                { "year": new Date().getFullYear() },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
    });
}

// Filter by string, directorate, date and value

module.exports.filterByStringDirectorateDateValue = (text, directorate, date, referenceDate, value) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterByStringDirectorateDateValueCount = (text, directorate, date, referenceDate, value) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directorates": { "$regex": directorate, "$options": "i" } },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string and date
module.exports.filterByStringDate = (text, date, referenceDate) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
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
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterByStringDateCount = (text, date, referenceDate) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
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
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string value 
module.exports.filterByStringValue = (text, value) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterByStringValueCount = (text, value) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by directorate and date 
module.exports.filterbyDirectorateDate = (directorate, date, referenceDate) => {
    return Contract.find({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
                { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterbyDirectorateDateCount = (directorate, date, referenceDate) => {
    return Contract.count({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
                { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by directorate and value
module.exports.filterByDirectorateValue = (directorate, value) => {
    return Contract.find({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterByDirectorateValueCount = (directorate, value) => {
    return Contract.count({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by date and value
module.exports.filterByDateValue = (date, referenceDate, value) => {
    return Contract.find({
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
                },
                { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterByDateValueCount = (date, referenceDate, value) => {
    return Contract.count({
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
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by directorate, date and value
module.exports.filterByDirectorateDateValue = (directorate, date, referenceDate, value) => {
    return Contract.find({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

module.exports.filterByDirectorateDateValueCount = (directorate, date, referenceDate, value) => {
    return Contract.count({
        "$and":
            [
                { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
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
                },
                { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string, directorate and value 
module.exports.filterByStringDirectorateValue = (text, directorate, value) => {
    return Contract.find({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterByStringDirectorateValueCount = (text, directorate, value) => {
    return Contract.count({
        "$and":
            [{
                "$or": [
                    { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                    { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                    { "company.slug": { "$regex": text, "$options": 'i' } }
                ]
            },
            { "directoratesSlug": { "$regex": directorate, "$options": "i" } },
            {
                "$or": [
                    { "contract.predictedValue": { "$regex": value } },
                    { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                ]
            },
            { "year": new Date().getFullYear() }
            ]
    });
}

// Filter by string, date, value

module.exports.filterByStringDateValue = (text, date, referenceDate, value) => {
    return Contract.find({
        "$and":
            [
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
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
                },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}
module.exports.filterByStringDateValueCount = (text, date, referenceDate, value) => {
    return Contract.count({
        "$and":
            [
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
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
                },
                {
                    "$or": [
                        { "contract.predictedValue": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxes": { "$regex": value } }
                    ]
                },
                { "year": new Date().getFullYear() }
            ]
    });
}