module.exports = function(app, tableData){
    var express = require('express');

    var route = express.Router();
    route.get('/', function (req, res) {

        var filteredArray = [];
        if (req.query != undefined){
            for (var param in req.query) {
                console.log(param, req.query[param]);
                if (tableData['job'][0][param]!=undefined){
                    for (var i = 0; i < tableData['job'].length; i ++){
                        if (tableData['job'][i][param] != req.query[param]){
                            if (!filteredArray.includes(tableData['job'][i])) filteredArray.push(tableData['job'][i]);
                        }
                    }
                }
             }
        }


        var output = [];
        if (tableData['job'] != undefined){
            for (var i = 0; i < tableData['job'].length; i ++){
                var isFiltered = false;
                for (var j = 0; j < filteredArray.length; j ++){
                    if (filteredArray[j].ClassID == tableData['job'][i].ClassID){
                        isFiltered = true;
                        break;
                    }
                }
                if (isFiltered) continue;
                output.push(tableData['job'][i]);
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    return route;
  }