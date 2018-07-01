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
    planned?: Number;
    budget?: Number;
    initiationDate?: Date;
    approvalDateOfFunds?: Date;
    torDate?: Date;
    contractPublicationDate?: Date;
    complaintsToAuthority1?: Number;
    complaintsToOshp1?: Number;
    bidOpeningDateTime?: Date;
    contractNoOfDownloads?: Number;
    contractNoOfOffers?: Number;
    noOfOffersForContract?: Number;
    startingOfEvaluationDate?: Date;
    endingOfEvaluationDate?: Date;
    noOfRefusedBids?: Number;
    reapprovalDate?: Date;
    standardeDocumentsForOe?: Date;
    publicationDateOfGivenContract: Date;
    cancellationNoticeDate?: Date;
    complaintsToAuthority2?: Number;
    complaintsToOshp2?: Number;
    predictedContractValue?: Number;
    oeType?: Number;
    applicationDeadlineType?: Number;
    contractCriteria?: Number;
    retender?: String;
    status?: Number;
    nameOfContractedOe?: String;
    signingDate?: Date;
    contractImplementationDeadlineStartingDate?: Date;
    contractImplementationDeadlineEndingDate?: Date;
    contractClosingDate?: Date;
    noOfPaymentInstallments?: Date;
    totalAmountOfAllAnnexContractsIncludingTaxes?: String;
    annexes?: Annex[];
    installments?: Installment[];
    lastInstallmendPayDate?: Date;
    lastInstallmendAmount?: String;
    discountAmount: Number;
    totalAmount?: String;
    department?: String;
    nameOfProdcurementOffical?: String;

    constructor() {
        this.activityTitle = '';
        this.procurementNo = 0;
        this.procurementType = 0;
        this.procurementValue = 0;
        this.procurementProcedure = 0;
        this.planned = 0;
        this.budget = 0;
        this.initiationDate = new Date();
        this.approvalDateOfFunds = new Date();
        this.torDate = new Date();
        this.contractPublicationDate = new Date();
        this.complaintsToAuthority1 = 0;
        this.complaintsToOshp1 = 0;
        this.bidOpeningDateTime = new Date();
        this.contractNoOfDownloads = 0;
        this.contractNoOfOffers = 0;
        this.noOfOffersForContract = 0;
        this.startingOfEvaluationDate = new Date();
        this.endingOfEvaluationDate = new Date();
        this.noOfRefusedBids = 0;
        this.reapprovalDate = new Date();
        this.standardeDocumentsForOe = new Date();
        this.publicationDateOfGivenContract = new Date();
        this.cancellationNoticeDate = new Date();
        this.complaintsToAuthority2 = 0;
        this.complaintsToOshp2 = 0;
        this.predictedContractValue = 0;
        this.oeType = 0;
        this.applicationDeadlineType = 0;
        this.contractCriteria = 0;
        this.retender = '';
        this.status = 0;
        this.nameOfContractedOe = '';
        this.signingDate = new Date();
        this.contractImplementationDeadlineStartingDate = new Date();
        this.contractImplementationDeadlineEndingDate = new Date();
        this.contractClosingDate = new Date();
        this.noOfPaymentInstallments = new Date();
        this.totalAmountOfAllAnnexContractsIncludingTaxes = '';
        this.annexes = [{
            totalValueOfAnnexContract1: '',
            annexContractSigningDate1: new Date()
        }];
        this.installments = [{
            installmentPayDate1: null,
            installmentAmount1: ''
        }];
        this.lastInstallmendPayDate = new Date();
        this.lastInstallmendAmount = '';
        this.discountAmount = 0;
        this.totalAmount = '';
        this.department = '';
        this.nameOfProdcurementOffical = '';
    }
}
