module.exports = function(app, serverData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        dataModule.RequestLog(req);
        var output = dataModule.DefaultQueryFilter(serverData['tableData']['map2'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    var typeList = [];
    var typeListCheckLength = [];
    route.get('/type/*', function (req, res) {
        var splited = req.url.split("/");
        var typeKey = splited[splited.length - 1];
        var dataLength = dataModule.getCount(serverData['tableData']['map2']);
        if (typeList[typeKey] == undefined || (typeListCheckLength[typeKey] != dataLength)){
            typeListCheckLength[typeKey] = dataLength;
            typeList[typeKey] = [];
            for (var i=0;i<dataLength;i++){
                if (serverData['tableData']['map2'][i][typeKey] == undefined) continue;
                if (typeList[typeKey].includes(serverData['tableData']['map2'][i][typeKey]) == false){
                    typeList[typeKey].push(serverData['tableData']['map2'][i][typeKey]);
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