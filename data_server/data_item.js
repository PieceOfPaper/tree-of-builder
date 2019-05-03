module.exports = function(app, serverData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        dataModule.RequestLog(req);
        var output = dataModule.DefaultQueryFilter(serverData['tableData']['item'], req.query);

        for (var i=0;i<output["datalist"].length;i++){
            if (output["datalist"][i]['Icon'] != undefined && output["datalist"][i]['IconPath'] == undefined){
                if (output["datalist"][i].TableName == "item_Equip" && 
                    output["datalist"][i]["EqpType"].toLowerCase() == 'outer' && 
                    output["datalist"][i]["UseGender"].toLowerCase() == 'both'){
                    var pathdatam = serverData['imagePath'][output["datalist"][i]['Icon'].toLowerCase()+'_m'];
                    var pathdataf = serverData['imagePath'][output["datalist"][i]['Icon'].toLowerCase()+'_f'];
                    if (pathdatam != null) {
                        output["datalist"][i]['Icon_mPath'] = pathdatam['path'];
                        output["datalist"][i]['Icon_mRect'] = pathdatam['imgrect'];
                    }
                    if (pathdataf != null) {
                        output["datalist"][i]['Icon_fPath'] = pathdataf['path'];
                        output["datalist"][i]['Icon_fRect'] = pathdataf['imgrect'];
                    }
                } else {
                    var pathdata = serverData['imagePath'][output["datalist"][i]['Icon'].toLowerCase()];
                    if (pathdata != null) {
                        output["datalist"][i]['IconPath'] = pathdata['path'];
                        output["datalist"][i]['IconRect'] = pathdata['imgrect'];
                    }
                }
            }
            if (output["datalist"][i]['TooltipImage'] != undefined && output["datalist"][i]['TooltipImagePath'] == undefined){
                var pathdata = serverData['imagePath'][output["datalist"][i]['TooltipImage']];
                if (pathdata != null) {
                    output["datalist"][i]['TooltipImagePath'] = pathdata['path'];
                    output["datalist"][i]['TooltipImageRect'] = pathdata['imgrect'];
                }
            }
            if (output["datalist"][i]['Illust'] != undefined && output["datalist"][i]['IllustPath'] == undefined){
                var pathdata = serverData['imagePath'][output["datalist"][i]['Illust']];
                if (pathdata != null) {
                    output["datalist"][i]['IllustPath'] = pathdata['path'];
                    output["datalist"][i]['IllustRect'] = pathdata['imgrect'];
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
        if (typeList[typeKey] == undefined || (lastTableLength != serverData['tableData']['item'].length)){
            lastTableLength = serverData['tableData']['item'].length;
            typeList[typeKey] = [];
            for (var i=0;i<serverData['tableData']['item'].length;i++){
                if (serverData['tableData']['item'][i][typeKey] == undefined) continue;
                if (typeList[typeKey].includes(serverData['tableData']['item'][i][typeKey]) == false){
                    typeList[typeKey].push(serverData['tableData']['item'][i][typeKey]);
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