const router = require('express').Router();
const Contract = require('../models/contracts');
const User = require('../models/user');
const Directorate = require('../models/directorates')
const passport = require("passport");
const compareValues = require("../utils/sortArrayByValues");
const order = require("../utils/sortArrayByValues")

/*
 * ENDPOINTS PREFIX: /data
 */

// TODO: If want to get contracts in range of two years you should add another year param in endpoint and handle it on query in model
router.get('/contracts-by-years-publication-date-signing-date/:year', (req, res) => {
    Contract.getContractsByYearWithPublicationDateAndSigningDate(req.params.year)
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

router.get('/contracts-count-by-years', (req, res) => {
    Contract.getTotalContractsByYears()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

router.get('/contracts-with-predicted-value-and-total-amount/:year', (req, res) => {
    Contract.getContractsByYearWithPredictedValueAndTotalAmount(req.params.year)
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

// Get top ten dominant contractors
router.get('/top-ten-contractors', (req, res) => {
    Contract.getTopTenContractors()
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
});

// Get Contracts by contractor name
router.get('/get-contracts-by-contractor/:companyName', (req, res) => {
    Contract.getContractsByContractorCompany(req.params.companyName)
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
});

// Get the directorates of contracts
router.get('/get-directorates-of-contracts', (req, res) => {
    Contract.getDirectoratesInContracts()
        .then(data => {

            let d = {
                adminObj: { name: 'Administratë', y: 0 },
                eduObj: { name: 'Arsim', y: 0 },
                infrastructureObj: { name: 'Infrastrukturë', y: 0 },
                investmentsObj: { name: 'Investime', y: 0 },
                culturObj: { name: 'Kulturë', y: 0 },
                publicServicesObj: { name: 'Shërbime Publike', y: 0 },
                healthObj: { name: 'Shëndetësi', y: 0 },
                cadasObj: { name: 'Kadastrës', y: 0 },
                socWelObj: { name: 'Mirëqenia Sociale', y: 0 },
                agriObj: { name: 'Bujqësisë', y: 0 },
                finaObj: { name: 'Financave', y: 0 },
                propObj: { name: 'Prona', y: 0 },
                urbanObj: { name: 'Urbanizmi', y: 0 },
                inspeObj: { name: 'Inspekcioni', y: 0 },
                planObj: { name: 'Planifikimit', y: 0 },
                parkObj: { name: 'Parqeve', y: 0 },
            }
            let toBeRemoved = [];

            // Process some data
            data.map((row, i) => {
                if (row.name == '') {
                    row.name = 'E pacaktuar';
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e administratës') {
                    d.adminObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Administratës') {
                    d.adminObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Administrate') {
                    d.adminObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Administratë') {
                    d.adminObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Administrata') {
                    d.adminObj.y += row.y
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria Arsimit') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria arsimit') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e arsimit') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Arsimit') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Arsim') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Arsimi') {
                    d.eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e infrastrukturës') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Infrastrukturës') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria Infrastrukturës') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria infrastrukturës') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Infrastrukture') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Infrastukture') {
                    d.infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Investime') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Investimet ka') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Investimne') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Invetsime') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria i Investimeve Kapitale dhe Menaxhim të Kontratave') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Investimeve Kapitale dhe Menaxhim të Kontratave') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria i investimeve kapitale dhe menaxhim të kontratave') {
                    d.investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e kulturës') {
                    d.culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e kulturës, rinisë dhe sportit') {
                    d.culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Kultura') {
                    d.culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Kulturë') {
                    d.culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'kultur') {
                    d.culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sh.Publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sh.p') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sherb publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sherbime Pub') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sherbime publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'sherbime Pub') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e shërbimeve publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria shërbimeve publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Shërbimeve Publike') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Shërbime Publike, Mbrojtjes dhe Shpëtimit') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Shërbimeve Publike, Mbrojtjes dhe Shpëtimit') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e shërbimeve publike, mbrojtjes dhe shpëtimit') {
                    d.publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Shendetesi') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Shendetsia') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Shëndetësisë') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e shëndetësisë') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria Shëndetësisë') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria shëndetësisë') {
                    d.healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "Drejtoria e kadastrit") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "Drejtoria e Kadastrit") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "Drejtoria kadastrit") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "Drejtoria Kadastrit") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "Kadastri") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == "kadastri") {
                    d.cadasObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e mirëqenies sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Mirëqenie Sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Mirëqenies Sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Mireqenie Sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Mirëqenie sociale') {
                    d.socWelObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Bujqesia') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Drejtoria e Bujqësisë') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Drejtoria e bujqësisë') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Bujqësisë') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Drejtoria e Bujqësis') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Bujqësia') {
                    d.agriObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Drejtoria e financave') {
                    d.finaObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Financa') {
                    d.finaObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Financës') {
                    d.finaObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria financës') {
                    d.finaObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e pronës') {
                    d.propObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Pronës') {
                    d.propObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Prona') {
                    d.propObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e urbanizmit') {
                    d.urbanObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e urbanizimit') {
                    d.urbanObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Urbanizimit') {
                    d.urbanObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Urbanizmi') {
                    d.urbanObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Inspekcion') {
                    d.inspeObj.y += row.y;
                    toBeRemoved.push(i)
                }
                if (row.name.trim() == 'Drejtoria e Inspekcionit') {
                    d.inspeObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Inspektimit') {
                    d.inspeObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e inspekcionit') {
                    d.inspeObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e planifikimit strategjik dhe zhvillimit të qëndrueshëm') {
                    d.planObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e Planifikimit Strategjik dhe Zhvillim të Qëndrueshëm') {
                    d.planObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Planifikim strategjik dhe zhvillimit të qëndrueshëm') {
                    d.planObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Parqeve') {
                    d.parkObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria e parqeve') {
                    d.parkObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name.trim() == 'Drejtoria parqeve') {
                    d.parkObj.y += row.y;
                    toBeRemoved.push(i);
                }
            });

            for (const k in d) {
                if (d[k].y !== 0) {
                    data.push(d[k]);
                }
            }

            for (let i = data.length; i >= 0; i--) {
                for (index of toBeRemoved) {
                    if (index == parseInt(i)) {
                        data.splice(index, 1);
                    }
                }
            }

            data.sort(compareValues('y', 'desc'));
            res.json(data);
        }).catch(err => {
            res.json(err);
        })
});

// Top ten highest total amount of contracts
router.get('/top-ten-contracts-with-highest-amount-by-year/:year', (req, res) => {
    Contract.getContractsMostByTotalAmountOfContract(req.params.year)
        .then(data => {

            // Processing some data
            // First we have to loop through the data and convert string currencies to numbers and find the difference between predicted value and total amount of contracts
            for (row of data) {
                row.totalAmountOfContractsIncludingTaxes = Number(row.totalAmountOfContractsIncludingTaxes.replace(/[^0-9\.-]+/g, ""));
                row.predictedValue = Number(row.predictedValue.replace(/[^0-9\.-]+/g, ""));
                row.differenceAmountBetweenPredictedAndTotal = row.totalAmountOfContractsIncludingTaxes > row.predictedValue ? row.totalAmountOfContractsIncludingTaxes - row.predictedValue : row.predictedValue - row.totalAmountOfContractsIncludingTaxes;
            }

            // Secondly we have compare and sort the data by the highest total amount
            data.sort(compareValues('totalAmountOfContractsIncludingTaxes', 'desc'));

            // Thirdly we loop again and convert back the numbers to currency strings with two decimals and format some other data
            for (row of data) {
                row.totalAmountOfContractsIncludingTaxes = row.totalAmountOfContractsIncludingTaxes.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                row.predictedValue = row.predictedValue.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                row.differenceAmountBetweenPredictedAndTotal = row.differenceAmountBetweenPredictedAndTotal.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                row.companyName = row.companyName.trim();
                if (row.publicationDateOfGivenContract == null) {
                    row.publicationDateOfGivenContract = "-";
                }
                if (row.signingDate == null) {
                    row.signingDate = "-";
                }
            }

            // Finally we limit the data array to get only the first tenth of contracts
            data.splice(10, data.length);

            // Serving data
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

router.get('/contracts-count-by-procurement-category-and-year/:category/:year', (req, res) => {
    let c = req.params.category;
    switch (c) {
        case 'type':
            c = 'procurementType'
            break;
        case 'value':
            c = 'procurementValue'
            break;
        case 'procedure':
            c = 'procurementProcedure'
            break;
        default:
            c = 'Not valid';
    }

    if (c == 'Not valid') {
        res.json({
            success: false,
            msg: 'Category is not valid, please ask for: type, value or procedure'
        });
    }

    Contract.getContractsCountByProcurementCategoryAndYear(req.params.year, c)
        .then(data => {
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
});

/*** Admin Dashboard ***/

// Users
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
    let obj = {};
    User.totalUsers()
        .then(tu => {
            obj['totalUsers'] = tu;
            return obj;
        }).then(obj => {
            return User.getTotalUsersByStatus(false)
                .then(iu => {
                    obj['totalInactiveUsers'] = iu;
                    return obj;
                })
        }).then(obj => {
            return User.getTotalUsersByStatus(true)
                .then(au => {
                    obj['totalActiveUsers'] = au;
                    return obj;
                })
        }).then(obj => {
            return User.getTotalUsersByDirectoratesStatus(false)
                .then(tuWithoutDir => {
                    obj['totalUsersWithoutDirectorate'] = tuWithoutDir;
                    return obj;
                })
        }).then(obj => {
            return User.getTotalUsersByDirectoratesStatus(true)
                .then(tuWithDir => {
                    obj['totalUsersWithDirectorate'] = tuWithDir;
                    return obj;
                })
        }).then(obj => {
            return User.getTotalUsersByRole("admin")
                .then(ta => {
                    obj['totalAdminUsers'] = ta;
                    return obj;
                })
        }).then(obj => {
            return User.getTotalUsersByRole("user")
                .then(ts => {
                    obj['totalSimpleUsers'] = ts;
                    return obj;
                })
        }).then(obj => {
            res.json(obj);
        }).catch(err => {
            res.json(err);
        })
});

// Directorates
router.get('/directorates', passport.authenticate('jwt', { session: false }), (req, res) => {
    let obj = {};
    Directorate.totalDirectorates()
        .then(td => {
            obj['totalDirectorates'] = td;
            return obj;
        }).then(obj => {
            return Directorate.getTotalDirectoratesByStatus(false)
                .then(tid => {
                    obj['totalInactiveDirectorates'] = tid;
                    return obj;
                })
        }).then(obj => {
            return Directorate.getTotalDirectoratesByStatus(true)
                .then(tad => {
                    obj['totalActiveDirectorates'] = tad;
                    return obj;
                })
        }).then(obj => {
            return Directorate.getTotalDirectoratesWithoutPeopleInCharge()
                .then(totalDwithoutChargePeople => {
                    obj['totalDirectoratesWithoutPeopleInCharge'] = totalDwithoutChargePeople;
                    return obj;
                })
        }).then(obj => {
            return Directorate.getTotalDirectoratesWithPeopleInCharge()
                .then(totalDwithChargePeople => {
                    obj['totalDirectoratesWithPeopleInCharge'] = totalDwithChargePeople;
                    return obj;
                })
        }).then(obj => {
            res.json(obj);
        }).catch(err => {
            res.json(err);
        })
});

// Contracts
router.get('/contracts', passport.authenticate('jwt', { session: false }), (req, res) => {
    let obj = {};
    Contract.getTotalContracts()
        .then(tc => {
            obj['totalContracts'] = tc;
            return obj;
        }).then(obj => {
            return Contract.getTotalContractsbyFlagStatus(0)
                .then(totalCDefaultFlag => {
                    obj['totalContractsWithoutFlagStatus'] = totalCDefaultFlag;
                    return obj;
                })
        }).then(obj => {
            return Contract.getTotalContractsbyFlagStatus(1)
                .then(totalCPendingFlag => {
                    obj['totalPendingContracts'] = totalCPendingFlag;
                    return obj;
                })
        }).then(obj => {
            return Contract.getTotalContractsbyFlagStatus(2)
                .then(totalCCompletedFlag => {
                    obj['totalCompletedContracts'] = totalCCompletedFlag;
                    return obj;
                })
        }).then(obj => {
            return Contract.getTotalContractsbyFlagStatus(3)
                .then(totalCRejectedFlag => {
                    obj['totalRefusedContracts'] = totalCRejectedFlag;
                    return obj;
                })
        }).then(obj => {
            res.json(obj);
        }).catch(err => {
            res.json(err);
        })
});

// Get all years from contract
router.get('/years/:from?', (req, res) => {
    if (req.params.from != null) {
        Contract.getContractYears(parseInt(req.params.from)).then(data => {
            data = data.sort(order("year", 'desc'));
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
    } else {
        Contract.getContractYears().then(data => {
            data = data.sort(order('year', 'desc'));
            res.json(data);
        }).catch(err => {
            res.json(err);
        });
    }
});
module.exports = router;
