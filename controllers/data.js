const router = require('express').Router();
const Contract = require('../models/contracts');
const User = require('../models/user');
const Directorate = require('../models/directorates')

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

/*** Admin Dashboard ***/

// Users
router.get('/user', (req, res) => {
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
router.get('/directorates', (req, res) => {
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
router.get('/contracts', (req, res) => {
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
})

module.exports = router;