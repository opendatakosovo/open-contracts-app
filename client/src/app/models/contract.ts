import { Installment } from './installment';
import { Annex } from './annex';
import { OnInit } from '@angular/core';

export class Contract {
    _id?: String;
    activityTitle?: String;
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
    nameOfProcurementOffical?: String;
    contract: {
        predictedValue?: String,
        totalAmountOfAllAnnexContractsIncludingTaxes?: String,
        totalAmountOfContractsIncludingTaxes?: String,
        totalPayedPriceForContract?: String,
        annexes?: Annex[]
        criteria?: String,
        implementationDeadlineStartingDate?: Date,
        implementationDeadlineEndingDate?: Date,
        implementationDeadlineStartingAndEndingDate?: String
        publicationDate?: Date,
        publicationDateOfGivenContract?: Date,
        closingDate?: Date,
        discountAmount?: String,
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
        this._id = '';
        this.activityTitle = '';
        this.procurementNo = 0;
        this.procurementType = '';
        this.procurementValue = '';
        this.procurementProcedure = '';
        this.planned = '';
        this.budget = [];
        this.initiationDate = new Date();
        this.approvalDateOfFunds = new Date();
        this.torDate = new Date();
        this.complaintsToAuthority1 = '';
        this.complaintsToOshp1 = '';
        this.bidOpeningDate = new Date();
        this.noOfCompaniesWhoDownloadedTenderDoc = 0;
        this.noOfCompaniesWhoSubmited = 0;
        this.startingOfEvaluationDate = new Date();
        this.endingOfEvaluationDate = new Date();
        this.noOfRefusedBids = 0;
        this.reapprovalDate = new Date();
        this.cancellationNoticeDate = new Date();
        this.complaintsToAuthority2 = '';
        this.complaintsToOshp2 = '0';
        this.applicationDeadlineType = '';
        this.retender = '';
        this.status = '';
        this.noOfPaymentInstallments = 0;
        this.installments = [{
            installmentPayDate1: new Date(),
            installmentAmount1: 0
        }];
        this.lastInstallmentPayDate = new Date();
        this.lastInstallmentAmount = '';
        this.company = {
            name: '',
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
            predictedValue: '',
            totalAmountOfAllAnnexContractsIncludingTaxes: '',
            totalAmountOfContractsIncludingTaxes: '',
            totalPayedPriceForContract: '',
            annexes: [
                {
                    totalValueOfAnnexContract1: 0,
                    annexContractSigningDate1: new Date(),
                },
            ],
            criteria: '',
            implementationDeadlineStartingDate: new Date(),
            implementationDeadlineEndingDate: new Date(),
            publicationDate: new Date(),
            publicationDateOfGivenContract: new Date(),
            closingDate: new Date(),
            discountAmount: '',
            file: '',
            signingDate: new Date()
        };
        this.year = 0;
        this.flagStatus = 0;
    }
}
