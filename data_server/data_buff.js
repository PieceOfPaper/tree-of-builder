module.exports = function(app, tableData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        dataModule.RequestLog(req);
        var output = dataModule.DefaultQueryFilter(tableData['buff'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    var typeList = [];
    var lastTableLength = 0;
    route.get('/type/*', function (req, res) {
        var splited = req.url.split("/");
        var typeKey = splited[splited.length - 1];
        if (typeList[typeKey] == undefined || (lastTableLength != tableData['buff'].length)){
            lastTableLength = tableData['buff'].length;
            typeList[typeKey] = [];
            for (var i=0;i<tableData['buff'].length;i++){
                if (tableData['buff'][i][typeKey] == undefined) continue;
                if (typeList[typeKey].includes(tableData['buff'][i][typeKey]) == false){
                    typeList[typeKey].push(tableData['buff'][i][typeKey]);
                }
            }
            typeList[typeKey].sort(function(a,b){
                if (a != b){
                    if (a == undefined) return -1;
                    else if (b == undefined) return 1;
                    else {
                        if ((typeof a)=="number" && (typeof b)=="number"){
                            if (a < b) return -1;
                            else return 1;
                        }
                        else if ((typeof a)=="string" && (typeof b)=="string"){
                            return a.localeCompare(b);
                        }
                        else if ((typeof a)=="boolean" && (typeof b)=="boolean"){
                            if (a) return -1;
                            else return 1;
                        }
                    }
                }
                return 0;
            });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(typeList[typeKey]));
    });

    return route;
  }