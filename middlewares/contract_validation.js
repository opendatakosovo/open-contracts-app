// Middleware that will validate the contract form fields
// if validation fails, errors will be returning in a list
// if validation passes, next middleware will be invoked
module.exports = (req, res, next) => {
    const requestedContract = JSON.parse(req.body.contract);
    const errors = [];

    if (isEmpty(requestedContract['activityTitle'])) {
        errors.push('Titulli i aktivitetit të prokurimit duhet plotësuar!');
    }
    if (isEmpty(requestedContract['directorates'])) {
        errors.push('Drejtoria duhet zgjedhur!');
    }
    if (isEmpty(requestedContract['nameOfProcurementOffical'])) {
        errors.push('Emri i zyrtarit të prokurimit duhet plotësuar!');
    }
    if (isEmpty(requestedContract['procurementNo']) || isEqual(requestedContract['procurementNo'], 0)) {
        errors.push('Numri rendor i prokurimit duhet plotësuar dhe nuk duhet të jetë zero!');
    }
    if (isEmpty(requestedContract['procurementType'])) {
        errors.push('Lloji i prokurimit duhet zgjedhur!');
    }
    if (isEmpty(requestedContract['procurementValue'])) {
        errors.push('Vlera e prokurimit duhet zgjedhur!');
    }
    if (isEmpty(requestedContract['procurementProcedure'])) {
        errors.push('Procedura e prokurimit duhet zgjedhur');
    }
    if (isEqualWithChars(requestedContract['fppClassification'])) {
        errors.push('Klasifikimi duhet të permbajë 2 shifra!');
    }
    if (isEqual(requestedContract.contract['totalAmountOfAllAnnexContractsIncludingTaxes'], 0)) {
        errors.push('Vlera totale e kontratës, duke përfshirë të gjitha anekset dhe të gjitha taksat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['noOfCompaniesWhoDownloadedTenderDoc'], 0)) {
        errors.push('Numri i OE që kanë shkarkuar dosjen e tenderit nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['noOfCompaniesWhoSubmited'], 0)) {
        errors.push('Numri i OE që kanë dorëzuar ofertat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['noOfRefusedBids'], 0)) {
        errors.push('Numri i ofertave të refuzuara nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract['predictedValue'], 0)) {
        errors.push('Vlera e parashikuar e kontratës nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['noOfPaymentInstallments'], 0)) {
        errors.push('Numri i përgjithshëm i situacioneve për pagesë, sipas kontratës nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract['totalAmountOfContractsIncludingTaxes'], 0)) {
        errors.push('Vlera totale e kontratës, duke përfshirë të gjitha taksat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract['totalAmountOfAllAnnexContractsIncludingTaxes'], 0)) {
        errors.push('Vlera totale e kontratës, duke përfshirë të gjitha anekset dhe të gjitha taksat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract.annexes[0]['totalValueOfAnnexContract1'], 0)) {
        errors.push('Vlera totale e Aneks kontratës duke përfshirë të gjitha taksat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.installments[0]['installmentAmount1'], 0)) {
        errors.push('Shuma e pagesës së situacionit nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['lastInstallmentAmount'], 0)) {
        errors.push('Shuma e pagesës së situacionit të fundit nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract['discountAmountFromContract'], 0)) {
        errors.push('Shuma e zbritjes nga kontrata për shkaqe të ndalesave nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract.contract['totalPayedPriceForContract'], 0)) {
        errors.push('Çmimi total i paguar për kontratën nuk duhet të jetë zero!');
    }
    if (isEmpty(requestedContract['year']) || isEqual(requestedContract['year'], 0)) {
        errors.push('Viti duhet plotësuar dhe duhet të jetë valid!');
    }

    // Function for checking if the input is equal to 0
    function isEqual(value, compareValue) {
        if (value == compareValue) {
            return true;
        }
        return false;
    }

    // Function for checking if the input is empty
    function isEmpty(text) {
        if (text === "" || text === null) {
            return true;
        }
        return false;
    }

    // Function for checking if the input length is equal to 2
    function isEqualWithChars(value) {
        if (value == null) {
            return false;
        }
        if (value.length > 2 || value.length === 1) {
            return true;
        }
    }

    if (errors.length > 0) {
        res.json({
            errVld: errors,
        });
    } else {
        next();
    }
}