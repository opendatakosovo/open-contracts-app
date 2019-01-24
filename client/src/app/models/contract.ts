import { Annex } from './annex';
import { Installment } from './installment';
import { Document } from './document';
import { Milestone } from './milestone';
import { Party } from './party';
import { Item } from './item';
import { Statistic } from './statistic';
import { Lot } from './lot';
export class Contract {
    _id?: String;
    uri?: String;
    version?: String;
    publishedDate?: Date;
    extensions?: String[];
    releases?: [
        {
            language?: String,
            date?: Date,
            id?: String,
            initiationType?: String,
            ocid?: String,
            tag?: String[],
            relatedProcesses?: [
                {
                    relationship?: String;
                }
            ]
            parties?: Party[],
            buyer?: {
                id?: String,
                name?: String,
            },
            planning?: {
                budget?: {
                    id?: String,
                    description?: String,
                    amount?: {
                        amount?: Number,
                        currency?: String
                    }
                },
                documents?: Document[],
                milestones?: Milestone[]
            },
            tender?: {
                id?: String,
                title?: String,
                date?: Date,
                status?: String,
                items?: Item[],
                numberOfTenderers?: Number,
                tenderers?: [{
                    name?: String,
                    id?: String
                }],
                value?: {
                    amount?: Number,
                    currency?: String
                },
                procurementMethod?: String,
                procurementMethodRationale?: String,
                mainProcurementCategory?: String,
                additionalProcurementCategories?: String,
                hasEnquiries?: Boolean,
                hasComplaints?: Boolean,
                tenderPeriod?: {
                    startDate?: Date
                },
                awardPeriod?: {
                    startDate?: Date,
                    endDate?: Date,
                    durationInDays?: String
                },
                contractPeriod?: {
                    startDate?: Date,
                    endDate?: Date,
                    durationInDays?: String
                },
                awardCriteria?: String,
                documents?: Document[],
                milestones?: Milestone[],
                estimatedSizeOfProcurementValue?: {
                    estimatedValue?: String
                },
                procedure?: {
                    isAcceleratedProcedure?: Boolean
                },
                lots?: Lot[]
            },
            awards?: [{
                id?: String,
                date?: Date,
                suppliers?: [{
                    id?: String,
                    name?: String
                }],
                contractPeriod?: {
                    startDate?: Date,
                    endDate?: Date,
                    durationInDays?: String
                };
                hasEnquiries?: Boolean,
                hasComplaints?: Boolean,
                complaintType?: String,
                enquiryType?: String
            }],
            contracts?: [{
                id?: String,
                awardID?: String,
                status?: String,
                period?: {
                    startDate?: Date,
                    endDate?: Date,
                    durationInDays?: String
                },
                value?: {
                    amount?: Number,
                    currency?: String
                };
                dateSigned?: Date,
                documents?: Document[],
                implementation?: {
                    transactions?: Installment[],
                    finalValue?: {
                        amount?: Number,
                        currency?: String
                    },
                    finalValueDetails?: String
                },
                amendments?: Annex[],
                expectedNumberOfTransactions?: Number,
                deductionAmountFromContract?: {
                    value?: {
                        amount?: Number,
                        currency?: String
                    }
                }
            }],
            bids?: {
                statistics?: Statistic[]
            }
        }
    ];
    publisher: {
        name?: String,
        uid?: String,
        uri?: String
    };
    activityTitleSlug?: String;
    company?: {
        slug?: String,
        headquarters?: {
            slug?: String
        }
    };
    directoratesSlug?: String;
    contract?: {
        predictedValueSlug?: String,
        totalAmountOfContractsIncludingTaxesSlug?: String,
        implementationDeadlineSlug?: String,
    };
    year?: Number;


    constructor() {
        this.uri = '';
        this.version = '1.1';
        this.publishedDate = null;
        this.extensions = [
            'https://raw.githubusercontent.com/open-contracting/ocds_bid_extension/v1.1.3/extension.json',
            'https://raw.githubusercontent.com/leobaz/ocds_estimatedSizeOfProcurementValue_extension/master/extension.json',
            'https://raw.githubusercontent.com/leobaz/ocds_isAcceleratedProcedure_extension/master/extension.json',
            'https://raw.githubusercontent.com/leobaz/ocds_expectedNumberOfTransactions_extension/master/extension.json',
            'https://raw.githubusercontent.com/open-contracting-extensions/ocds_contract_completion_extension/master/extension.json',
            'https://raw.githubusercontent.com/leobaz/ocds_deductionAmountFromContract_extension/master/extension.json'
        ];
        this.releases = [{
            language: 'sq',
            date: null,
            id: '',
            initiationType: 'tender',
            ocid: '',
            tag: [
                'contract'
            ],
            relatedProcesses: [{
                relationship: ''
            }],
            parties: [
                {
                    identifier: {
                        scheme: '',
                        id: '',
                        legalName: '',
                        uri: ''
                    },
                    name: '',
                    address: {
                        streetAddress: '',
                        locality: '',
                        region: '',
                        postalCode: '',
                        countryName: ''
                    },
                    contactPoint: {
                        name: '',
                        email: '',
                        telephone: '',
                        faxNumber: '',
                        url: ''
                    },
                    roles: [],
                    id: '',
                    details: {
                        local: null
                    }
                },
                {
                    identifier: {
                        scheme: '',
                        id: '',
                        legalName: '',
                        uri: ''
                    },
                    name: '',
                    address: {
                        streetAddress: '',
                        locality: '',
                        region: '',
                        postalCode: '',
                        countryName: ''
                    },
                    contactPoint: {
                        name: '',
                        email: '',
                        telephone: '',
                        faxNumber: '',
                        url: ''
                    },
                    roles: [],
                    id: ''
                }
            ],
            buyer: {
                id: '',
                name: ''
            },
            planning: {
                budget: {
                    id: '',
                    description: '',
                    amount: {
                        amount: 0,
                        currency: 'EUR'
                    },
                },
                documents: [],
                milestones: [
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    },
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    },
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    },
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    }
                ]
            },
            tender: {
                id: '',
                title: '',
                date: null,
                status: '',
                items: [],
                numberOfTenderers: 0,
                tenderers: [{
                    name: '',
                    id: ''
                }],
                value: {
                    amount: 0,
                    currency: 'EUR'
                },
                procurementMethod: '',
                procurementMethodRationale: '',
                mainProcurementCategory: '',
                additionalProcurementCategories: '',
                hasEnquiries: null,
                hasComplaints: null,
                tenderPeriod: {
                    startDate: null,
                },
                awardPeriod: {
                    startDate: null,
                    endDate: null,
                    durationInDays: ''
                },
                contractPeriod: {
                    startDate: null,
                    endDate: null,
                    durationInDays: ''
                },
                awardCriteria: '',
                documents: [],
                milestones: [
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    },
                    {
                        id: '',
                        title: '',
                        type: '',
                        code: '',
                        dateMet: null,
                        status: ''
                    }
                ],
                estimatedSizeOfProcurementValue: {
                    estimatedValue: ''
                },
                procedure: {
                    isAcceleratedProcedure: null
                },
                lots: []
            },
            awards: [{
                id: '',
                date: null,
                suppliers: [{
                    id: '',
                    name: ''
                }],
                contractPeriod: {
                    startDate: null,
                    endDate: null,
                    durationInDays: ''
                },
                hasEnquiries: null,
                hasComplaints: null,
                complaintType: '',
                enquiryType: ''
            }],
            contracts: [{
                id: '',
                awardID: '',
                status: '',
                period: {
                    startDate: null,
                    endDate: null,
                    durationInDays: ''
                },
                value: {
                    amount: 0,
                    currency: 'EUR'
                },
                dateSigned: null,
                documents: [],
                implementation: {
                    transactions: [],
                    finalValue: {
                        amount: 0,
                        currency: 'EUR'
                    },
                    finalValueDetails: 'The total amount of the contract payed'
                },
                amendments: [],
                expectedNumberOfTransactions: 0,
                deductionAmountFromContract: {
                    value: {
                        amount: 0,
                        currency: 'EUR'
                    }
                }
            }],
            bids: {
                statistics: [
                    {
                        id: '',
                        measure: '',
                        value: 0,
                        notes: ''
                    },
                    {
                        id: '',
                        measure: '',
                        value: 0,
                        notes: ''
                    }
                ]
            }
        }];
        this.publisher = {
            name: 'Open Data Kosovo',
            uid: '5200316-4',
            uri: 'http://opendatakosovo.org'
        };
        this.activityTitleSlug = '';
        this.company = {
            slug: '',
            headquarters: {
                slug: ''
            }
        };
        this.contract = {
            predictedValueSlug: '',
            totalAmountOfContractsIncludingTaxesSlug: ''
        };
        this.year = 0;
    }

}
