import { Installment } from './installment';
import { Annex } from './annex';
import { OnInit } from '@angular/core';

export class Contract {
    activityTitle?: String;
    procurementNo?: Number;
    procurementType?: String;
    procurementValue?: Number;
    procurementProcedure?: Number;
    fppClassification?: Number;
    planned?: Number;
    budget?: String[];
    initiationDate?: Date;
    approvalDateOfFunds?: Date;
    torDate?: Date;
    complaintsToAuthority1?: String;
    complaintsToOshp1?: String;
    applicationDeadlineType?: String
    bidOpeningDateTime?: Date;
    NoOfCompaniesWhoDownloadedTenderDoc?: Number;
    NoOfCompaniesWhoSubmited?: Number;
    startingOfEvaluationDate?: Date;
    endingOfEvaluationDate?: Date;
    noOfRefusedBids?: Number;
    reapprovalDate?: Date;
    cancellationNoticeDate?: Date;
    complaintsToAuthority2?: String;
    complaintsToOshp2?: String;
    retender?: String;
    status?: String;
    noOfPaymentInstallments?: Number;
    installments?: Installment[];
    lastInstallmendPayDate?: Date;
    lastInstallmendAmount?: String;
    totalAmount?: Number;
    directorates?: String;
    nameOfProcurementOffical?: String;
    signingDate?: Date;
    contract: {
        predictedValue?: Number,
        totalAmountOfAllAnnexContractsIncludingTaxes?: Number,
        price?: Number,
        annexes?: Annex[]
        deadlineType?: Number,
        criteria?: String,
        implementationDeadlineStartingDate?: Date,
        ImplementationDeadlineEndingDate?: Date,
        publicationDate?: Date,
        publicationDateOfGivenContract?: Date,
        closingDate?: Date,
        discountAmountFromContract?: Number,
        file?: String
    };
    company: {
        name?: String,
        slug?: { type: String },
        headquarters?: {
            name?: String,
            slug?: String
        },
        type: String,
        standardDocuments?: String
    };
    year?: Number;
    flagStatus?: Number;


    constructor() {
        this.activityTitle = '';
        this.procurementNo = 0;
        this.procurementType = '';
        this.procurementValue = 0;
        this.procurementProcedure = 0;
        this.planned = 0;
        this.budget = [];
        this.initiationDate = new Date();
        this.approvalDateOfFunds = new Date();
        this.torDate = new Date();
        this.complaintsToAuthority1 = '';
        this.complaintsToOshp1 = '';
        this.bidOpeningDateTime = new Date();
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
        this.signingDate = new Date();
        this.noOfPaymentInstallments = 0;
        this.installments = [{
            installmentPayDate1: null,
            installmentAmount1: ''
        }];
        this.lastInstallmendPayDate = new Date();
        this.lastInstallmendAmount = '';
        this.totalAmount = 0;
        this.directorates = '';
        this.nameOfProcurementOffical = '';
        this.contract = {
            predictedValue: 0,
            totalAmountOfAllAnnexContractsIncludingTaxes: 0,
            price: 0,
            annexes: [],
            deadlineType: 0,
            criteria: '',
            implementationDeadlineStartingDate: new Date(),
            ImplementationDeadlineEndingDate: new Date(),
            publicationDate: new Date(),
            publicationDateOfGivenContract: new Date(),
            closingDate: new Date(),
            discountAmountFromContract: 0,
            file: ''
        };
        this.year = 0;
        this.flagStatus = 0;
    }
}
