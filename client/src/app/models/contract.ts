import { Installment } from './installment';
import { Annex } from './annex';
import { OnInit } from '@angular/core';

export class Contract {
    activityTitle?: String;
    procurementNo?: Number;
    procurementType?: Number;
    procurementValue?: Number;
    procurementProcedure?: Number;
    fppClassification?: Number;
    planned?: String;
    budget?: String[];
    initiationDate?: Date;
    approvalDateOfFunds?: Date;
    torDate?: Date;
    complaintsToAuthority1?: String;
    complaintsToOshp1?: String;
    applicationDeadlineType?: String;
    bidOpeningDate?: Date;
    noOfCompaniesWhoDownloadedTenderDoc?: Number;
    noOfCompaniesWhoSubmited?: Number;
    startingOfEvaluationDate?: Date;
    endingOfEvaluationDate?: Date;
    startingAndEndingEvaluationDate?: String;
    noOfRefusedBids?: Number;
    reapprovalDate?: Date;
    cancellationNoticeDate?: Date;
    complaintsToAuthority2?: String;
    complaintsToOshp2?: String;
    retender?: String;
    status?: String;
    noOfPaymentInstallments?: Number;
    installments?: Installment[];
    lastInstallmentPayDate?: Date;
    lastInstallmentAmount?: Number;
    directorates?: String;
    nameOfProcurementOffical?: String;
    contract: {
        predictedValue?: Number,
        totalAmountOfAllAnnexContractsIncludingTaxes?: Number,
        totalAmountOfContractsIncludingTaxes?: Number,
        totalPayedPriceForContract?: Number,
        annexes?: Annex[]
        criteria?: String,
        implementationDeadlineStartingDate?: Date,
        ImplementationDeadlineEndingDate?: Date,
        implementationDeadlineStartingAndEndingDate?: String
        publicationDate?: Date,
        publicationDateOfGivenContract?: Date,
        closingDate?: Date,
        discountAmount?: Number,
        file?: String,
        signingDate?: Date;
    };
    company: {
        name?: String,
        slug?: String,
        headquarters?: {
            name?: String,
            slug?: String
        },
        type: String,
        standardDocuments?: Date
    };
    year?: Number;
    flagStatus?: Number;


    constructor() {
        this.activityTitle = '';
        this.procurementNo = 0;
        this.procurementType = 0;
        this.procurementValue = 0;
        this.procurementProcedure = 0;
        this.planned = '';
        this.budget = [];
        this.initiationDate = new Date();
        this.approvalDateOfFunds = new Date();
        this.torDate = new Date();
        this.complaintsToAuthority1 = '';
        this.complaintsToOshp1 = '';
        this.bidOpeningDate = new Date();
        this.startingOfEvaluationDate = new Date();
        this.endingOfEvaluationDate = new Date();
        this.noOfRefusedBids = 0;
        this.reapprovalDate = new Date();
        this.cancellationNoticeDate = new Date();
        this.complaintsToAuthority2 = '';
        this.complaintsToOshp2 = '';
        this.applicationDeadlineType = '';
        this.retender = '';
        this.status = '';
        this.noOfPaymentInstallments = 0;
        this.installments = [{
            installmentPayDate1: null,
            installmentAmount1: 0
        }];
        this.lastInstallmentPayDate = new Date();
        this.lastInstallmentAmount = 0;
        this.company = {
            name: 'test test',
            slug: '',
            headquarters: {
                name: '',
                slug: ''
            },
            type: '',
            standardDocuments: new Date()
        };
        this.directorates = '';
        this.nameOfProcurementOffical = '';
        this.contract = {
            predictedValue: 0,
            totalAmountOfAllAnnexContractsIncludingTaxes: 0,
            totalAmountOfContractsIncludingTaxes: 0,
            totalPayedPriceForContract: 0,
            annexes: [],
            criteria: '',
            implementationDeadlineStartingDate: new Date(),
            ImplementationDeadlineEndingDate: new Date(),
            publicationDate: new Date(),
            publicationDateOfGivenContract: new Date(),
            closingDate: new Date(),
            discountAmount: 0,
            file: '',
            signingDate: new Date()
        };
        this.year = 0;
        this.flagStatus = 0;
    }
}
