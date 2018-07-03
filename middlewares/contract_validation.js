// Middleware that will validate the contract form fields
// if validation fails, errors will be returning in a list
// if validation passes, next middleware will be invoked
module.exports = (req, res, next) => {
    const requestedContract = JSON.parse(req.body.contract);
    const errors = [];

    if (isEmpty(requestedContract['activityTitle'])) {
        errors.push('Titulli i aktivitetit të prokurimit duhet plotësuar!');
    }
    if (isEmpty(requestedContract['department'])) {
        errors.push('Drejtoria duhet zgjedhur!');
    }
    if (isEmpty(requestedContract['nameOfProdcurementOffical'])) {
        errors.push('Emri i zyrtarit të prokurimit duhet plotësuar!');
    }
    if (isEmpty(requestedContract['procurementNo']) || isEqual(requestedContract['procurementNo'], 0)) {
        errors.push('Numri rendor i prokurimit duhet plotësuar dhe nuk duhet të jetë zero!');
    }
    if (isEmpty(requestedContract['procurementType']) || isEqual(requestedContract['procurementType'], 0)) {
        errors.push('Lloji i prokurimit duhet plotësuar dhe nuk duhet të jetë zero!');
    }
    if (isEmpty(requestedContract['procurementValue']) || isEqual(requestedContract['procurementValue'], 0)) {
        errors.push('Vlera e prokurimit duhet plotësuar dhe nuk duhet të jetë zero!');
    }
    if (isEmpty(requestedContract['procurementProcedure']) || isEqual(requestedContract['procurementProcedure'], 0)) {
        errors.push('Procedura e prokurimit duhet plotësuar dhe nuk duhet të jetë zero!');
    }
    if (isEqualWithChars(requestedContract['fppClassification'])) {
        errors.push('Klasifikimi duhet të permbajë 2 shifra!');
    }
    if (isEqual(requestedContract['contractNoOfDownloads'], 0)) {
        errors.push('Numri i OE që kanë shkarkuar dosjen e tenderit nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['noOfOffersForContract'], 0)) {
        errors.push('Numri i OE që kanë dorëzuar ofertat nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['predictedContractValue'], 0)) {
        errors.push('Vlera e parashikuar e kontratës nuk duhet të jetë zero!');
    }
    if (isEqual(requestedContract['totalAmountOfAllAnnexContractsIncludingTaxes'], 0)) {
        errors.push('Vlera totale e kontratës, duke përfshirë të gjitha anekset dhe të gjitha taksat nuk duhet të jetë zero!');
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