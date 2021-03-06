var fs = require('fs');
const csv = require('fast-csv');
var stream = fs.createReadStream("output/Token Distribution Master_Send List_03042019_0215pm_v2.csv");
let csvData = []; let failed = []; let fixed = []; let item;
var csvStream = csv()
    .on("data", function(data){
        if(data[6].indexOf(',')>=0) {
            failed.push(csvData.length);
            //console.log(data[6]);
        }
        if(data[0]!=='wallet address'){
            csvData.push(data);
        }
    })
    .on("end", function(){
        console.log("csv",csvData.length);
        let allocationData = require("../../output/allocation-final-Mar4-mainnet.json");
        // for (i in failed) {
        //     let index = failed[i];
        for (i in allocationData.allocations) {
            let index = i;
            item = allocationData.allocations[index];
            item.name = csvData[index][6];
            item.email = csvData[index][7];
            item.firstName = csvData[index][8];
            item.investedAmount = csvData[index][9];
            item.investedDiscount = csvData[index][10];
            fixed.push(item);
            //console.log(csvData[failed[i]][7]);
        }
        allocationData.allocations = fixed;
        //console.log(fixed);
        // console.log("allocationData",allocationData.allocations.length);
        // console.log("failed",failed.length)
        fs.writeFile(
            "output/allocation-rebuild-Mar4-mainnet.json",
            JSON.stringify(allocationData),
            { flag: 'w' },
            (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('done')
                }
            },
        );

    });

stream.pipe(csvStream);