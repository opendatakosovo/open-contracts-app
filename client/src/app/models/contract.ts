import { Annex } from './annex';
import { Installment } from './installment';
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
            parties?: [{
                identifier?: {
                    scheme?: String,
                    id?: String,
                    legalName?: String,
                    uri?: String
                },
                name?: String,
                address?: {
                    streetAddress?: String,
                    locality?: String,
                    region?: String,
                    postalCode?: String,
                    countryName?: String
                },
                contactPoint?: {
                    name?: String,
                    email?: String,
                    telephone?: String,
                    faxNumber?: String,
                    url?: String
                };
                roles?: String[],
                id?: String,
                details?: {
                    local?: Boolean
                }
            },
                {
                    identifier?: {
                        scheme?: String,
                        id?: String,
                        legalName?: String,
                        uri?: String
                    },
                    name?: String,
                    address?: {
                        streetAddress?: String,
                        locality?: String,
                        region?: String,
                        postalCode?: String,
                        countryName?: String
                    },
                    contactPoint?: {
                        name?: String,
                        email?: String,
                        telephone?: String,
                        faxNumber?: String,
                        url?: String
                    };
                    roles?: String[],
                    id?: String,
                    details?: {
                        local?: Boolean
                    }
                }
            ],
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
                documents?: [
                    {
                        id?: String,
                        documentType?: String
                    }
                ],
                milestones?: [
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    },
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    },
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    },
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    }
                ]
            },
            tender?: {
                id?: String,
                title?: String,
                date?: Date,
                status?: String,
                items?: [
                    {
                        id?: String,
                        description?: String,
                        classification?: {
                            scheme?: String,
                            id?: String,
                            description?: String
                        };
                        quantity?: Number
                    }
                ],
                numberOfTenderers?: Number,
                tenderers?: {
                    name?: String,
                    id?: String
                },
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
                milestones?: [
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    },
                    {
                        id?: String,
                        title?: String,
                        type?: String,
                        code?: String,
                        dateMet?: Date,
                        status?: String
                    }
                ],
                estimatedSizeOfProcurementValue?: {
                    estimatedValue?: String
                },
                procedure?: {
                    isAcceleratedProcedure?: Boolean
                }
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
                documents?: [{
                    id?: String,
                    documentType?: String,
                    title?: String,
                    url?: String,
                    format?: String,
                    language?: String
                }],
                implementation?: {
                    transactions?: Installment[],
                    finalValue?: {
                        amount?: Number,
                        currency?: String
                    },
                    finalValueDetails?: String
                },
                amendments?: [
                    {
                        date?: Date,
                        description?: String
                    }
                ],
                expectedNumberOfTransactions?: Number,
                deductionAmountFromContract?: {
                    value?: {
                        amount?: Number,
                        currency?: String
                    }
                }
            }],
            bids?: {
                statistics?: [
                    {
                        id?: String,
                        measure?: String,
                        value?: Number,
                        notes?: String
                    },
                    {
                        id?: String,
                        measure?: String,
                        value?: Number,
                        notes?: String
                    }
                ]
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
                        legalName: ''
                    },
                    name: '',
                    address: {
                        region: '',
                        postalCode: '',
                        countryName: ''
                    },
                    contactPoint: {
                        name: '',
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
                        legalName: ''
                    },
                    name: '',
                    address: {
                        region: '',
                        postalCode: '',
                        countryName: ''
                    },
                    contactPoint: {
                        name: '',
                        url: ''
                    },
                    roles: [],
                    id: '',
                    details: {
                        local: null
                    }
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
                documents: [
                    {
                        id: '',
                        documentType: 'procurementPlan'
                    }
                ],
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
                items: [{
                    id: '',
                    description: 'The CPV number for the services provided',
                    classification: {
                        scheme: 'CPV',
                        id: 'CPV',
                        description: 'The common procurement vocabulary number'
                    },
                    quantity: 0
                }],
                numberOfTenderers: 0,
                tenderers: {
                    name: '',
                    id: ''
                },
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
                }
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
                documents: [{
                    id: '',
                    documentType: '',
                    title: '',
                    url: '',
                    format: '',
                    language: ''
                }],
                implementation: {
                    transactions: [],
                    finalValue: {
                        amount: 0,
                        currency: 'EUR'
                    },
                    finalValueDetails: 'The total amount of the contract payed'
                },
                amendments: [
                    {
                        date: null,
                        description: ''
                    }
                ],
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
