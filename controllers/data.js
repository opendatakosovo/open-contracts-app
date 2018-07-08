const router = require('express').Router();
const Contract = require('../models/contracts');

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

module.exports = router;