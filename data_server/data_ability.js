module.exports = function(app, tableData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        var output = dataModule.DefaultQueryFilter(tableData['ability'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    var typeList = [];
    route.get('/type/*', function (req, res) {
        var splited = req.url.split("/");
        var typeKey = splited[splited.length - 1];
        if (typeList[typeKey] == undefined){
            typeList[typeKey] = [];
            for (var i=0;i<tableData['ability'].length;i++){
                if (typeList[typeKey].includes(tableData['ability'][i][typeKey]) == false){
                    typeList[typeKey].push(tableData['ability'][i][typeKey]);
                }
            }
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(typeList[typeKey]));
    });

    return route;
  }