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

            let adminObj = { name: 'Administratë', y: 0 };
            let eduObj = { name: 'Arsim', y: 0 };
            let infrastructureObj = { name: 'Infrastrukturë', y: 0 };
            let investmentsObj = { name: 'Investime', y: 0 };
            let culturObj = { name: 'Kulturë', y: 0 };
            let publicServicesObj = { name: 'Shërbime Publike', y: 0 };
            let healthObj = { name: 'Shëndetësi', y: 0 };
            let toBeRemoved = [];

            // Process some data
            data.map((row, i) => {
                if (row.name == '') {
                    row.name = 'E pacaktuar';
                }
                if (row.name == 'Administrate') {
                    adminObj.y += row.y
                    toBeRemoved.push(i);
                }
                if (row.name == 'Administrata') {
                    adminObj.y += row.y
                    toBeRemoved.push(i);
                }
                if (row.name == 'Arsim') {
                    eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Arsimi') {
                    eduObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Infrastrukture') {
                    infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Infrastukture') {
                    infrastructureObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Investime') {
                    investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Investimet ka') {
                    investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Investimne') {
                    investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Invetsime') {
                    investmentsObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Kultura') {
                    culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Kulturë') {
                    culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'kultur') {
                    culturObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Sh.Publike') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Sh.p') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Sherb publike') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Sherbime Pub') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Sherbime publike') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'sherbime Pub') {
                    publicServicesObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Shendetesi') {
                    healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
                if (row.name == 'Shendetsia') {
                    healthObj.y += row.y;
                    toBeRemoved.push(i);
                }
            });

            data.push(adminObj);
            data.push(eduObj);
            data.push(infrastructureObj);
            data.push(investmentsObj);
            data.push(culturObj);
            data.push(publicServicesObj);
            data.push(healthObj);

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
        console.log(req.params)
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
})
module.exports = router;