const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const {Data} = require('../models/data');
const {Team} = require('../models/team');
const {Kpi} = require('../models/kpi');
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only JSON files
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JSON files are allowed.'));
        }
    },
}); 

router.get('/counts', async (req,res) => {

    const dataCounts = await Data.countDocuments({});
    const kpiCounts = await Kpi.countDocuments({});
    const teamCounts = await Team.countDocuments({});

    res.status(200).send([{
        count : dataCounts,
        icon : "bi bi-check",
        name : "Total Data",
        id :1
    }, { 
        count : kpiCounts,
        icon : "bi bi-exclamation-triangle", 
        name : "Total KPI",
        id : 2
    }, {
        count :teamCounts, 
        icon : "bi bi-people",
        name : "Total Team",
        id : 3
    }]);

});

router.get(`/data`, async (req, res) =>{
    const { formattedDate, attribute } = req.query;
    const query = {
        'kpiAttribute': attribute,
        'formattedDate': formattedDate,
      };
      if (!formattedDate && !attribute) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }else{
        const filteredData = await Data.find(query);
        console.log(filteredData);
        res.status(200).json(filteredData);
      }
});

router.get(`/date`, async (req, res) =>{
    const dateList = await Data.distinct("formattedDate");
    console.log(dateList);
    if(!dateList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(dateList);
});

router.post('/file', upload.single('jsonFile'), async (req, res) => {
    const kpiValueList = JSON.parse(req.file.buffer.toString('utf-8'));
    axios.get('https://warwick-backend-34369cb85885.herokuapp.com/api/v1/teams').then((response) => {
        let teamList = response.data;
        const teamMap = new Map();
        teamList.forEach(team => {
            teamMap.set(team.number, {
                name: team.name,
                number: team.number
            });
        });
        const mergedWaccTable = kpiValueList.wacc.map(waccEntry => {
            const teamInfo = teamMap.get(waccEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: waccEntry.team,
                kpiAttribute: "wacc",
                kpiName: "WACC",
                value: waccEntry.value,
            };
        });
        const mergedFactoryUtilizationTable = kpiValueList.factory_utilization.map(utilizationEntry => {
            const teamInfo = teamMap.get(utilizationEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: utilizationEntry.team,
                kpiAttribute: "factory_utilisation",
                kpiName: "Factory Utilisation",
                value: utilizationEntry.value,
            };
        });
        const mergedEmployeeEngagementTable = kpiValueList.employee_engagement.map(engagementEntry => {
            const teamInfo = teamMap.get(engagementEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: engagementEntry.team,
                kpiAttribute: "employee_engagement",
                kpiName: "Employee Engagement",
                value: engagementEntry.value,
            };
        });
        const mergedInterestCoverageTable = kpiValueList.interest_coverage.map(interestEntry => {
            const teamInfo = teamMap.get(interestEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: interestEntry.team,
                kpiAttribute: "interest_coverage",
                kpiName: "Interest Coverage",
                value: interestEntry.value,
            };
        });
        const mergedScoresTable = kpiValueList.scores.map(scoresEntry => {
            const teamInfo = teamMap.get(scoresEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: scoresEntry.team,
                kpiAttribute: "scores",
                kpiName: "Scores",
                value: scoresEntry.value,
            };
        });
        const mergedMarketingSpendRevTable = kpiValueList.marketing_spend_rev.map(marketingEntry => {
            const teamInfo = teamMap.get(marketingEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: marketingEntry.team,
                kpiAttribute: "marketing_spend_rev",
                kpiName: "Cumulative Marketing Spend/Rev",
                value: marketingEntry.value,
            };
        });
        const mergedECarSalesTable = kpiValueList.e_cars_sales.map(carsEntry => {
            const teamInfo = teamMap.get(carsEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: carsEntry.team,
                kpiAttribute: "e_cars_sales",
                kpiName: "eCAR Sales",
                value: carsEntry.value,
            };
        });
        const mergedPenaltyTable = kpiValueList.co2_penalty.map(penaltyEntry => {
            const teamInfo = teamMap.get(penaltyEntry.team);
            return {
                teamName: teamInfo ? teamInfo.name : "Unknown",
                teamNumber: penaltyEntry.team,
                kpiAttribute: "co2_penalty",
                kpiName: "CO2 Penalty",
                value: penaltyEntry.value,
            };
        });

        let selectedDate = req.body.selectedDate;
        let formattedDate = req.body.formattedDate;
        const mergedTables = [
            ...mergedWaccTable,
            ...mergedFactoryUtilizationTable,
            ...mergedEmployeeEngagementTable,
            ...mergedInterestCoverageTable,
            ...mergedScoresTable,
            ...mergedMarketingSpendRevTable,
            ...mergedECarSalesTable,
            ...mergedPenaltyTable
        ];

        const convertedData = mergedTables.map((item) => ({
            currentDate: new Date(),
            selectedDate: selectedDate,
            formattedDate: formattedDate,
            addedBy : "Hakan",
            teamName : item.teamName,
            teamNumber: item.teamNumber,
            kpiAttribute: item.kpiAttribute,
            kpiName: item.kpiName,
            value: item.value
        }));

        Data.insertMany(convertedData).then(() => {
            res.status(201).send('ok');
        });
    })
})

module.exports = router;