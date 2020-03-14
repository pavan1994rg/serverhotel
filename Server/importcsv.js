const fs = require('fs');
const mysql = require('mysql');
const csv = require('fast-csv');
let commondao = require("./commonDao.js");
var common = new commondao();
var skipHeader = true;
var skipBlankSpace = true;
module.exports = class UploadCSV {
    constructor(){

    }
    importcsv(fileName){
        console.log(fileName);

        let stream = fs.createReadStream('./uploads/'+fileName);
        let myData = [];
        let csvStream = csv
            .parse()
            .on("data", function (data) {
                //for skipping blank row in csv
                if (skipBlankSpace && data.length === 0) {
                    skipBlankSpace = true;
               }
               // for skipping header of csv
                else if(skipHeader){
                     skipHeader = false;
                } 
                else{
                    myData.push(data);
                }
                
        
               })
               .on("end", function () {
        
                console.log(myData);
                
                // get connection
                const result = common.inportCSV(myData);
                // open the connection
                    if (!result) {
                        console.log('Not inserted');
                        return false;
                    } else {
                        console.log('Inserted successfully');
                    }
                    myData.shift();
        
            });
        
        stream.pipe(csvStream);
        return true;
    }
}
