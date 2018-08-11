import { Installment } from './installment';
import { Annex } from './annex';
import { OnInit } from '@angular/core';
import { DATE } from '../../../node_modules/ngx-bootstrap/chronos/units/constants';

export class Contract {
    _id?: String;
    activityTitle?: String;
    activityTitleSlug?: String;
    procurementNo?: Number;
    procurementType?: String;
    procurementValue?: String;
    procurementProcedure?: String;
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
    lastInstallmentAmount?: String;
    directorates?: String;
    directoratesSlug?: String;
    nameOfProcurementOffical?: String;
    contract: {
        predictedValue?: String,
        totalAmountOfAllAnnexContractsIncludingTaxes?: String,
        totalAmountOfContractsIncludingTaxes?: String,
        totalPayedPriceForContract?: String,
        annexes?: Annex[]
        criteria?: String,
        implementationDeadline?: String,
        implementationDeadlineSlug?: String,
        publicationDate?: Date,
        publicationDateOfGivenContract?: Date,
        closingDate?: Date,
        discountAmountFromContract?: String,
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
        this.procurementNo = null;
        this.procurementType = '';
        this.procurementValue = '';
        this.procurementProcedure = '';
        this.planned = '';
        this.budget = [];
        this.initiationDate = null;
        this.approvalDateOfFunds = null;
        this.torDate = null;
        this.complaintsToAuthority1 = '';
        this.complaintsToOshp1 = '';
        this.bidOpeningDate = null;
        this.noOfCompaniesWhoDownloadedTenderDoc = 0;
        this.noOfCompaniesWhoSubmited = 0;
        this.startingOfEvaluationDate = null;
        this.endingOfEvaluationDate = null;
        this.noOfRefusedBids = 0;
        this.reapprovalDate = null;
        this.cancellationNoticeDate = null;
        this.complaintsToAuthority2 = '';
        this.complaintsToOshp2 = '0';
        this.applicationDeadlineType = '';
        this.retender = '';
        this.status = '';
        this.noOfPaymentInstallments = 0;
        this.installments = [];
        this.lastInstallmentPayDate = null;
        this.lastInstallmentAmount = '';
        this.company = {
            name: '',
            slug: '',
            headquarters: {
                name: '',
                slug: ''
            },
            type: '',
            standardDocuments: null
        };
        this.directorates = '';
        this.nameOfProcurementOffical = '';
        this.contract = {
            predictedValue: '',
            totalAmountOfAllAnnexContractsIncludingTaxes: '',
            totalAmountOfContractsIncludingTaxes: '',
            totalPayedPriceForContract: '',
            annexes: [],
            criteria: '',
            implementationDeadline: '',
            publicationDate: null,
            publicationDateOfGivenContract: null,
            closingDate: null,
            discountAmountFromContract: '',
            file: '',
            signingDate: null
        };
        this.year = 0;
        this.flagStatus = 1;
    }

}
