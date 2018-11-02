module.exports = function(app, tableData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        var output = dataModule.DefaultQueryFilter(tableData['skill'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    var classTypeList = [];
    route.get('/classType', function (req, res) {
        if (classTypeList <= 0){
            for (var i=0;i<tableData['skill'].length;i++){
                if (classTypeList.includes(tableData['skill'][i].ClassType) == false){
                    classTypeList.push(tableData['skill'][i].ClassType);
                }
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(classTypeList));
    });

    return route;
  }