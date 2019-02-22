const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const schemaOptions = {
    timestamps: true,
    versionKey: false
};

const ContractSchema = mongoose.Schema({
    uri: { type: String },
    version: { type: String, default: "1.1" },
    publishedDate: { type: Date, default: Date.now() },
    extensions: [{ type: String }],
    releases: [{
        language: { type: String, default: "sq" },
        date: { type: Date },
        id: { type: String },
        initiationType: { type: String, default: "tender" },
        ocid: { type: String },
        tag: [{ type: String, default: "contract" }],
        relatedProcesses: [{
            relationship: { type: String }
        }],
        parties: [{
            name: { type: String },
            address: {
                region: { type: String },
                postalCode: { type: String },
                countryName: { type: String }
            },
            contactPoint: {
                name: { type: String },
                url: { type: String }
            },
            roles: [{ type: String }],
            id: { type: String },
            details: {
                local: { type: Boolean }
            }
        }],
        buyer: {
            id: { type: String },
            name: { type: String }
        },
        planning: {
            budget: {
                id: { type: String },
                description: { type: String },
                amount: {
                    amount: { type: Number },
                    currency: { type: String }
                }
            },
            documents: [{
                id: { type: String },
                documentType: { type: String }
            }],
            milestones: [
                {
                    id: { type: String },
                    title: { type: String },
                    type: { type: String },
                    code: { type: String },
                    dateMet: { type: Date },
                    status: { type: String }
                }
            ]
        },
        tender: {
            id: { type: String },
            title: { type: String },
            date: { type: Date },
            status: { type: String },
            items: [{
                id: { type: String },
                description: { type: String },
                classification: {
                    scheme: { type: String },
                    id: { type: String },
                    description: { type: String }
                },
                quantity: { type: Number }
            }],
            numberOfTenderers: { type: Number },
            tenderers: [{
                name: { type: String },
                id: { type: String }
            }],
            value: {
                amount: { type: Number },
                currency: { type: String, default: 'EUR' }
            },
            procurementMethod: { type: String },
            procurementMethodRationale: { type: String },
            mainProcurementCategory: { type: String },
            additionalProcurementCategories: { type: String },
            hasEnquiries: { type: Boolean },
            hasComplaints: { type: Boolean },
            tenderPeriod: {
                startDate: { type: Date }
            },
            awardPeriod: {
                startDate: { type: Date },
                endDate: { type: Date },
                durationInDays: { type: String }
            },
            contractPeriod: {
                startDate: { type: Date },
                endDate: { type: Date },
                durationInDays: { type: String }
            },
            awardCriteria: { type: String },
            documents: [{
                id: { type: String },
                documentType: { type: String },
                title: { type: String },
                url: { type: String },
                format: { type: String },
                language: { type: String }
            }],
            milestones: [
                {
                    id: { type: String },
                    title: { type: String },
                    type: { type: String },
                    code: { type: String },
                    dateMet: { type: Date },
                    status: { type: String }
                }
            ],
            estimatedSizeOfProcurementValue: {
                estimatedValue: { type: String }
            },
            procedure: {
                isAcceleratedProcedure: { type: Boolean }
            },
            lots: [
                {
                    id: { type: String },
                    description: { type: String },
                    value: {
                        amount: { type: Number },
                        currency: { type: String, default: 'EUR' }
                    }
                }
            ]
        },
        awards: [{
            id: { type: String },
            date: { type: Date },
            suppliers: [{
                id: { type: String },
                name: { type: String }
            }],
            contractPeriod: {
                startDate: { type: Date },
                endDate: { type: Date },
                durationInDays: { type: String }
            },
            hasEnquiries: { type: Boolean },
            hasComplaints: { type: Boolean },
            complaintType: { type: String },
            enquiryType: { type: String }
        }],
        contracts: [{
            id: { type: String },
            awardID: { type: String },
            status: { type: String },
            period: {
                startDate: { type: Date },
                endDate: { type: Date },
                durationInDays: { type: String }
            },
            value: {
                amount: { type: Number },
                currency: { type: String, default: 'EUR' }
            },
            dateSigned: { type: Date },
            documents: [{
                id: { type: String },
                documentType: { type: String },
                title: { type: String },
                url: { type: String },
                format: { type: String },
                language: { type: String }
            }],
            implementation: {
                transactions: [
                    {
                        id: { type: String },
                        date: { type: Date },
                        payer: {
                            id: { type: String },
                            name: { type: String }
                        },
                        payee: {
                            id: { type: String },
                            name: { type: String }
                        },
                        value: {
                            amount: { type: Number },
                            currency: { type: String, default: 'EUR' }
                        }
                    }
                ],
                finalValue: {
                    amount: { type: Number },
                    currency: { type: String, default: 'EUR' }
                },
                finalValueDetails: { type: String, default: 'The total amount of the contract payed' }
            },
            amendments: [
                {
                    date: { type: Date },
                    description: { type: String }
                }
            ],
            expectedNumberOfTransactions: { type: Number },
            deductionAmountFromContract: {
                value: {
                    amount: { type: Number },
                    currency: { type: String, default: 'EUR' }
                }
            }
        }
        ],
        bids: {
            statistics: [
                {
                    id: { type: String },
                    measure: { type: String },
                    value: { type: Number },
                    notes: { type: String }
                }
            ]
        }
    }
    ],
    publisher: {
        name: { type: String, default: 'Open Data Kosovo' },
        uid: { type: String, default: '5200316-4' },
        uri: { type: String, default: 'http://opendatakosovo.org' }
    },
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
        installmentAmount1: { type: String }
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
        predictedValueSlug: { type: String },
        totalAmountOfAllAnnexContractsIncludingTaxes: { type: String },
        totalAmountOfContractsIncludingTaxes: { type: String },
        totalAmountOfContractsIncludingTaxesSlug: { type: String },
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
    documents: [{ type: String }]
}, schemaOptions);


const Contract = module.exports = mongoose.model('Contract', ContractSchema);

module.exports.addContract = (contract, cb) => {
    contract.save(cb);
}

module.exports.getAllContracts = cb => Contract.find().exec(cb);

module.exports.getContractById = (id, cb) => {
    Contract.findById(id, cb);
}

module.exports.getContractByOcidJson = (ocid, cb) => {
    Contract.find({ "releases.ocid": ocid }, { "releases.tender.items._id": 0, "releases._id": 0, "releases.parties._id": 0, "releases.awards._id": 0, "releases.awards.suppliers._id": 0, "releases.awards.items._id": 0, "releases.contracts._id": 0, "releases.contracts.items._id": 0, "releases.contracts.implementation.transactions._id": 0, "releases.planning.documents._id": 0, "releases.planning.milestones._id": 0, "releases.relatedProcesses._id": 0, "releases.contracts.amendments._id": 0, "releases.tender.milestones._id": 0, "releases.bids.statistics._id": 0, "_id": 0, "company": 0, "contract": 0, "budget": 0, "year": 0 }, cb);
}

module.exports.deleteContractById = (id, callback) => {
    Contract.findByIdAndRemove(id, callback);
}

module.exports.deleteContractsByYear = (year) => {
    return Contract.deleteMany({ "year": year });
}

module.exports.updateContract = (id, contract, callback) => {
    Contract.findByIdAndUpdate(id, { $set: contract }, { new: true }, callback);
}

module.exports.updateAllContracts = (updatedContract, callback) => {
    Contract.updateMany({ "year": { "$gte": 2010 } }, { $set: updatedContract }, { new: true }, callback);
}

// Function for finding 2018 contracts
module.exports.latestContracts = (callback) => {
    Contract.find({ "year": { "$gte": 2018 } }, callback);
}

module.exports.countLatestContracts = () => {
    return Contract.find({ "year": { "$gte": 2018 } }).count();
}

module.exports.countContracts = (role, directorateName) => {
    return Contract.count();
}

module.exports.getContractsByDirectorate = directorateName => {
    return Contract.find({"releases.buyer.name": directorateName});
}


// Data Visualizations

module.exports.getContractsByYearWithPublicationDateAndSigningDate = (year) => {
    return Contract.aggregate([
        {
            $match: year == "any" ? {
                "releases.contracts.period.startDate": { $ne: null },
                "releases.awards.date": { $ne: null }
            } : {
                    $or: [{
                        year: parseInt(year)
                    }],
                    "releases.contracts.period.startDate": { $ne: null },
                    "releases.awards.date": { $ne: null },
                }
        },
        { $group: { _id: { publicationDateOfGivenContract: "$releases.awards.date", signingDate: "$releases.contracts.period.startDate", activityTitle: '$releases.tender.title' }, count: { $sum: 1 } } },
        { $project: { _id: 0, publicationDateOfGivenContract: "$_id.publicationDateOfGivenContract", signingDate: "$_id.signingDate", totalContracts: "$count", activityTitle: '$_id.activityTitle' } },
        { $unwind: '$publicationDateOfGivenContract' },
        { $unwind: '$signingDate' },
        { $unwind: '$publicationDateOfGivenContract' },
        { $unwind: '$signingDate' },
        { $unwind: '$activityTitle' }
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
                'releases.planning.budget.amount.amount': { $ne: '' },
                'releases.tender.value.amount': { $ne: '' },
            } : {
                    year: parseInt(year),
                    'releases.planning.budget.amount.amount': { $ne: '' },
                    'releases.tender.value.amount': { $ne: '' },
                }
        },
        { $group: { _id: { id: "$_id", activityTitle: "$releases.tender.title", predictedValue: "$releases.planning.budget.amount.amount", totalAmountOfContractsIncludingTaxes: "$releases.tender.value.amount" } } },
        { $project: { _id: 0, id: "$_id.id", activityTitle: "$_id.activityTitle", predictedValue: "$_id.predictedValue", totalAmountOfContractsIncludingTaxes: "$_id.totalAmountOfContractsIncludingTaxes" } },
        { $unwind: '$activityTitle' },
        { $unwind: '$predictedValue' },
        { $unwind: '$totalAmountOfContractsIncludingTaxes' },
        { $sort: { predictedValue: -1 } }
    ]);
}

module.exports.getTopTenContractors = () => {
    return Contract.aggregate([
        { $match: { "releases.tender.tenderers.name": { "$ne": "" } } },
        {
            $group: { _id: "$releases.tender.tenderers.name", count: { $sum: 1 } }
        },
        { $unwind: "$_id" },
        { $unwind: "$_id" },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, name: "$_id", y: "$count" } }
    ]);
}

module.exports.getContractsByContractorCompany = companyName => {
    return Contract.find({ "releases.tender.tenderers.name": companyName });
}


module.exports.getContractsMostByTotalAmountOfContract = year => {
    return Contract.aggregate([
        {
            $match: year == "any" ? { "releases.tender.value.amount": { $ne: 0 } } : {
                year: parseInt(year),
                "releases.tender.value.amount": { $ne: 0 },
            }
        },
        {
            $group: {
                _id: {
                    procurementNo: '$releases.tender.id',
                    activityTitle: '$releases.tender.title',
                    companyName: '$releases.tender.tenderers.name',
                    publicationDateOfGivenContract: "$releases.awards.date",
                    signingDate: "$releases.contracts.period.startDate",
                    totalAmountOfContractsIncludingTaxes: "$releases.tender.value.amount",
                    predictedValue: "$releases.planning.budget.amount.amount"
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
        },
        { $unwind: '$activityTitle' },
        { $unwind: '$totalAmountOfContractsIncludingTaxes' },
        { $unwind: '$predictedValue' },
        { $unwind: '$procurementNo' },
        { $unwind: '$companyName' },
        { $unwind: '$companyName' },
        { $unwind: '$publicationDateOfGivenContract' },
        { $unwind: '$publicationDateOfGivenContract' },
        { $unwind: '$signingDate' },
        { $unwind: '$signingDate' }
    ]);
}

module.exports.getContractsByYears = year => {
    return Contract.find({ year: Number(year) });
}

module.exports.getContractsByProcurementCategory = category => {
    return Contract.find({"releases.tender.procurementMethodRationale": category});
}

module.exports.getContractsByProcurementType = type => {
    return Contract.find({"releases.tender.additionalProcurementCategories": type});
}

module.exports.getContractsByProcurementValue = value => {
    return Contract.find({"releases.tender.estimatedSizeOfProcurementValue.estimatedValue": value});
}

module.exports.getDirectoratesInContracts = year => {
    return Contract.aggregate([
        {
            $match: year == "any" ? { "releases.buyer.name": { $ne: '' } } : {
                year: parseInt(year),
                "releases.buyer.name": { $ne: '' },
            }
        },
        { $group: { _id: "$releases.buyer.name", count: { $sum: 1 } } },
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

module.exports.getContractsCountByProcurementCategoryAndYear = (y, c) => {
    let agg = [];

    if (y !== 'any') {
        agg.push({ $match: { year: parseInt(y) } });
    }

    agg.push({ $group: { _id: `$${c}`, count: { $sum: 1 } } });
    agg.push({ $project: { _id: 0, "name": "$_id", "y": "$count" } });
    agg.push({ $unwind: '$name' });


    return Contract.aggregate(agg);
}


/** Dashboard Data **/
// Get total contracts by flag status
module.exports.getTotalContractsbyFlagStatus = flagStatus => Contract.find({ "releases.contracts.status": flagStatus }).count();

// Get total contracts
module.exports.getTotalContracts = () => Contract.find().count();

// Filter functions
// Filter by any string field
let education = ['Drejtoria Arsimit', 'Drejtoria e arsimit', 'Arsim', 'Arsimi', 'Drejtoria arsimit', 'Drejtoria e Arsimit'];
let administration = ['Drejtoria e Administratës', 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm', 'Administrate', 'Administrata', 'Drejtoria administratës', 'Drejtoria Administratës'];
let infrastructure = ['Drejtoria e infrastrukturës', 'Infrastrukture', 'Infrastukture', 'Drejtoria e Infrastrukturës', 'Drejtoria Infrastrukturës', 'Drejtoria infrastrukturës'];
let investment = ['Investime', 'Investimet ka', 'Drejtoria i Investimeve Kapitale dhe Menaxhim të Kontratave', 'Drejtoria e investimeve kapitale dhe menaxhim të kontratave', 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave', 'Invetsime', 'Drejtoria e Investimit', 'Drejtoria i investimeve kapitale dhe menaxhim të kontratave'];
let culture = ['Kultura', 'Kulturë', 'kultur', 'Drejtoria e Kulturës', 'Drejtoria Kulturës', 'Drejtoria kulturës', 'Drejtoria e kulturës', 'Drejtoria e kulturës, rinisë dhe sportit'];
let publicServices = ['Sh.Publike', 'Sh.p', 'Sherb publike', 'Sherbime Pub', 'Sherbime publike', 'sherbime Pub', 'Drejtoria e shërbimeve publike', 'Drejtoria e Shërbimeve Publike', 'Shërbime Publike, Mbrojtjes dhe Shpëtimit', 'Drejtoria e Shërbimeve Publike, Mbrojtjes dhe Shpëtimit', 'Drejtoria e shërbimeve publike, mbrojtjes dhe shpëtimit'];
let health = ['Shendetesi', 'Shendetsia', 'Drejtoria e Shëndetësisë', 'Drejtoria Shëndetësisë', 'Drejtoria shëndetësisë', 'Drejtoria e shëndetësisë'];
let cadastre = ['Drejtoria e Kadastrit', 'Drejtoria e kadastrit', 'Drejtoria kadastrit', 'Drejtoria Kadastrit', 'Kadastri', 'kadastri'];
let socialWelfare = ['Drejtoria e Mirëqenies Sociale', 'Drejtoria e mirëqenies sociale', 'Mirëqenie Sociale', 'Sociale', 'Mireqenie Sociale'];
let agriculture = ['Drejtoria e Bujqësisë', 'Bujësisë', 'Drejtoria e Bujqësis', 'Drejtoria e bujqësisë', 'Drejtoria bujqësisë', 'Drejtoria Bujqësisë', 'Bujqësia'];
let fincances = ['Drejtoria e Financave', 'Financa', 'Financës', 'Drejtoria Financës', 'Drejtoria financës', 'Drejtoria e financave']
let property = ['Drejtoria e pronës', 'Drejtoria e Pronës', 'Prona', 'Drejtoria Pronës', 'Drejtoria Pronës'];
let urbanism = ['Drejtoria e urbanizimit', 'Drejtoria e urbanizmit', 'Drejtoria e Urbanizimit', 'Urbanizmi', 'Drejtoria Urbanizimit'];
let inspection = ['Inspekcion', 'Drejtoria e inspektimit', 'Drejtoria e inspekcionit'];
let planning = ['Planifikim strategjik dhe zhvillimit të qëndrueshëm', 'Drejtoria e planifikimit strategjik dhe zhvillimit të qëndrueshëm'];
let parks = ['Drejtoria e parqeve', 'Parqeve', 'Drejtoria parqeve'];

module.exports.filterStringFieldsInContracts = (text, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match": {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                }
                ]
        }
    })
    return Contract.aggregate(filter);
}

module.exports.filterStringFieldsInContractsCount = (text, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }

    filter.push(
        {
            "$match": {
                "$and":
                    [{
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }
                    ]
            }
        }, {
            "$count": "total"
        }
    )

    return Contract.aggregate(filter);
}
// Filter by directorate 
module.exports.filterByDirectorate = (directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match": {
            "releases.parties": {
                "$elemMatch": {
                    "name": {
                        "$in": queryArray
                    }
                }
            }
        }
    })
    return Contract.aggregate(filter);
}

module.exports.filterByDirectorateCount = (directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }

    filter.push({
        "$match": {
            "releases.parties": {
                "$elemMatch": {
                    "name": {
                        "$in": queryArray
                    }
                }
            }
        }
    },
        {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by date 
module.exports.filterByDate = (date, referenceDate, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$or": [
                {
                    "releases.tender.date":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.awards.date":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.contracts.period.startDate":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.tender.milestones": {
                        "$elemMatch": {
                            "dateMet":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        }
                    }
                }
            ]
        }
    })
    return Contract.aggregate(filter);
}

module.exports.filterByDateCount = (date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$or": [
                {
                    "releases.tender.date":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.awards.date":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.contracts.period.startDate":
                    {
                        "$gte": new Date(date),
                        "$lt": new Date(referenceDate)
                    }
                },
                {
                    "releases.tender.milestones": {
                        "$elemMatch": {
                            "dateMet":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        }
                    }
                }
            ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by value
module.exports.filterByValue = (value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$or": [
                { "contract.predictedValueSlug": { "$regex": value } },
                { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
            ]
        }

    })
    return Contract.aggregate(filter);
}

module.exports.filterByValueCount = (value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$or": [
                { "contract.predictedValueSlug": { "$regex": value } },
                { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
            ]
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string and directorate 
module.exports.filterByStringAndDirectorate = (text, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                }
                ]
        }

    });
    return Contract.aggregate(filter);
}

module.exports.filterByStringAndDirectorateCount = (text, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                }
                ]
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string, directorate, date
module.exports.filterbyStringDirectorateDate = (text, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }]
        }
    })
    return Contract.aggregate(filter);
}
module.exports.filterbyStringDirectorateDateCount = (text, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string, directorate, date and value
module.exports.filterByStringDirectorateDateValue = (text, directorate, date, referenceDate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }


    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                {
                    "$or": [
                        {
                            "releases.tender.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.awards.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.contracts.period.startDate":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.tender.milestones": {
                                "$elemMatch": {
                                    "dateMet":
                                    {
                                        "$gte": new Date(date),
                                        "$lt": new Date(referenceDate)
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterByStringDirectorateDateValueCount = (text, directorate, date, referenceDate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                {
                    "$or": [
                        {
                            "releases.tender.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.awards.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.contracts.period.startDate":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.tender.milestones": {
                                "$elemMatch": {
                                    "dateMet":
                                    {
                                        "$gte": new Date(date),
                                        "$lt": new Date(referenceDate)
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string and date
module.exports.filterByStringDate = (text, date, referenceDate, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                            "releases.tender.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.awards.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.contracts.period.startDate":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.tender.milestones": {
                                "$elemMatch": {
                                    "dateMet":
                                    {
                                        "$gte": new Date(date),
                                        "$lt": new Date(referenceDate)
                                    }
                                }
                            }
                        }
                    ]
                }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterByStringDateCount = (text, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                            "releases.tender.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.awards.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.contracts.period.startDate":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.tender.milestones": {
                                "$elemMatch": {
                                    "dateMet":
                                    {
                                        "$gte": new Date(date),
                                        "$lt": new Date(referenceDate)
                                    }
                                }
                            }
                        }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string value 
module.exports.filterByStringValue = (text, value, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByStringValueCount = (text, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by directorate and date 
module.exports.filterbyDirectorateDate = (directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterbyDirectorateDateCount = (directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by directorate and value
module.exports.filterByDirectorateValue = (directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByDirectorateValueCount = (directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by date and value
module.exports.filterByDateValue = (date, referenceDate, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByDateValueCount = (date, referenceDate, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by directorate, date and value
module.exports.filterByDirectorateDateValue = (directorate, date, referenceDate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }

    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterByDirectorateDateValueCount = (directorate, date, referenceDate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string, directorate and value 
module.exports.filterByStringDirectorateValue = (text, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByStringDirectorateValueCount = (text, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

// Filter by string, date, value

module.exports.filterByStringDateValue = (text, date, referenceDate, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByStringDateValueCount = (text, date, referenceDate, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNo = (procurementNo, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "releases.tender.id": procurementNo
        }

    })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoCount = (procurementNo, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "releases.tender.id": procurementNo
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoString = (procurementNo, text, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match": {
            "$and": [
                {
                    "releases.tender.id": procurementNo
                }, {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                }
            ]
        }
    })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoStringCount = (procurementNo, text, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and": [
                {
                    "releases.tender.id": procurementNo
                }, {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                }
            ]
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorate = (procurementNo, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                ]
        }

    });
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorateCount = (procurementNo, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                ]
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorateString = (procurementNo, text, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                }
                ]
        }
    });
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorateStringCount = (procurementNo, text, directorate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "releases.parties": {
                        "$elemMatch": {
                            "name": {
                                "$in": queryArray
                            }
                        }
                    }
                },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoValue = (procurementNo, value, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and": [
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                },
                {
                    "releases.tender.id": procurementNo
                }

            ]
        }

    })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoValueCount = (procurementNo, value, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and": [
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                },
                {
                    "releases.tender.id": procurementNo
                }

            ]
        }

    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}
module.exports.filterByProcurementNoValueString = (procurementNo, text, value, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    });
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoValueStringCount = (procurementNo, text, value, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "releases.tender.id": procurementNo
                },
                {
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "$or": [
                        { "contract.predictedValueSlug": { "$regex": value } },
                        { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorateValue = (procurementNo, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoDirectorateValueCount = (procurementNo, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoStringDirectorateValue = (procurementNo, text, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }, {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoStringDirectorateValueCount = (procurementNo, text, directorate, value, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    }, {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDate = (procurementNo, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterByProcurementNoDateCount = (procurementNo, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoStringDate = (procurementNo, text, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}

module.exports.filterByProcurementNoStringDateCount = (procurementNo, text, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [{
                    "$or": [
                        { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                        { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                        { "company.slug": { "$regex": text, "$options": 'i' } }
                    ]
                },
                {
                    "releases.tender.id": procurementNo
                },
                {
                    "$or": [
                        {
                            "releases.tender.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.awards.date":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.contracts.period.startDate":
                            {
                                "$gte": new Date(date),
                                "$lt": new Date(referenceDate)
                            }
                        },
                        {
                            "releases.tender.milestones": {
                                "$elemMatch": {
                                    "dateMet":
                                    {
                                        "$gte": new Date(date),
                                        "$lt": new Date(referenceDate)
                                    }
                                }
                            }
                        }
                    ]
                }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDirectorateDate = (procurementNo, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoDirectorateDateCount = (procurementNo, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoStringDirectorateDate = (procurementNo, text, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoStringDirectorateDateCount = (procurementNo, text, directorate, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    }, {
                        "releases.tender.id": procurementNo
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoDateValue = (procurementNo, value, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoDateValueCount = (procurementNo, value, date, referenceDate, year) => {
    let filter = [];

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterByProcurementNoStringDateValue = (procurementNo, text, value, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterByProcurementNoStringDateValueCount = (procurementNo, text, value, date, referenceDate, year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
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
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterbyProcurementNoDirectorateValueDate = (procurementNo, directorate, value, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterbyProcurementNoDirectorateValueDateCount = (procurementNo, directorate, value, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterbyProcurementNoStringDirectorateValueDate = (procurementNo, text, directorate, value, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
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
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    })
    return Contract.aggregate(filter)
}
module.exports.filterbyProcurementNoStringDirectorateValueDateCount = (procurementNo, text, directorate, value, date, referenceDate, year) => {
    let filter = [];
    let queryArray = [];
    if (directorate == 'Drejtoria e Arsimit') {
        education.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Administratës') {
        administration.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Infrastruktures') {
        infrastructure.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
        investment.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kulturës') {
        culture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shërbimeve Publike') {
        publicServices.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Shëndetësisë') {
        health.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Kadastrit') {
        cadastre.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Mirëqenies Sociale') {
        socialWelfare.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Bujqësis') {
        agriculture.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Financave') {
        fincances.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Pronës') {
        property.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Urbanizmit') {
        urbanism.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Inspekcionit') {
        inspection.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
        planning.forEach(element => {
            queryArray.push(element);
        });
    }
    if (directorate == 'Drejtoria e Parqeve') {
        parks.forEach(element => {
            queryArray.push(element);
        });
    }

    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    filter.push({
        "$match":
        {
            "$and":
                [
                    {
                        "releases.parties": {
                            "$elemMatch": {
                                "name": {
                                    "$in": queryArray
                                }
                            }
                        }
                    },
                    {
                        "releases.tender.id": procurementNo
                    },
                    {
                        "$or": [
                            { "activityTitleSlug": { "$regex": text, "$options": 'i' } },
                            { "contract.implementationDeadlineSlug": { "$regex": text, "$options": 'i' } },
                            { "company.slug": { "$regex": text, "$options": 'i' } }
                        ]
                    },
                    {
                        "$or": [
                            { "contract.predictedValueSlug": { "$regex": value } },
                            { "contract.totalAmountOfContractsIncludingTaxesSlug": { "$regex": value } }
                        ]
                    },
                    {
                        "$or": [
                            {
                                "releases.tender.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.awards.date":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.contracts.period.startDate":
                                {
                                    "$gte": new Date(date),
                                    "$lt": new Date(referenceDate)
                                }
                            },
                            {
                                "releases.tender.milestones": {
                                    "$elemMatch": {
                                        "dateMet":
                                        {
                                            "$gte": new Date(date),
                                            "$lt": new Date(referenceDate)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
        }
    }, {
            "$count": "total"
        })
    return Contract.aggregate(filter);
}

module.exports.filterContractsbyYear = (year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } })
    }
    return Contract.aggregate(filter);
}

module.exports.filterContractsbyYearCount = (year) => {
    let filter = [];
    if (year !== 'any') {
        filter.push({ "$match": { "year": year } }, {
            "$count": "total"
        })
    }
    return Contract.aggregate(filter);
}

