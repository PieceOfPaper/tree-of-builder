module.exports = function(app, tableData, imagePath){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');
    var tos = require('../my_modules/TosModule');

    var route = express.Router();
    route.get('/', function (req, res) {
        dataModule.RequestLog(req);
        var output = dataModule.DefaultQueryFilter(tableData['ability'], req.query);

        for (var i=0;i<output["datalist"].length;i++){
            if (output["datalist"][i]['Icon'] != undefined && output["datalist"][i]['IconPath'] == undefined){
                var pathdata = imagePath[output["datalist"][i]['Icon'].toLowerCase()];
                if (pathdata != null) {
                    output["datalist"][i]['IconPath'] = pathdata['path'];
                    output["datalist"][i]['IconRect'] = pathdata['imgrect'];
                }
            }
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    var typeList = [];
    var lastTableLength = 0;
    route.get('/type/*', function (req, res) {
        var splited = req.url.split("/");
        var typeKey = splited[splited.length - 1];
        if (typeList[typeKey] == undefined || (lastTableLength != tableData['ability'].length)){
            lastTableLength = tableData['ability'].length;
            typeList[typeKey] = [];
            for (var i=0;i<tableData['ability'].length;i++){
                if (tableData['ability'][i][typeKey] == undefined) continue;
                if (typeList[typeKey].includes(tableData['ability'][i][typeKey]) == false){
                    typeList[typeKey].push(tableData['ability'][i][typeKey]);
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