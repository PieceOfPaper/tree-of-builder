module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    var http = require('http');
    var https = require('https');
    var fs = require('fs');

    var csv = require('csv-parser');
    var xml = require('xml-parser');
    
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    var layout = fs.readFileSync('./web/Layout/index-ability.html');
    var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');
  
    //var search_box = fs.readFileSync('./web/Skill/search_box.html');
    // var jobTable = serverData['tableData']['job'];
    // var skillTable = serverData['tableData']['skill'];
    // var skillTreeTable = serverData['tableData']['skilltree'];
  
    route.get('/', function (request, response) {
      tos.RequestLog(request);

      // id값이 존재하는 경우, 상세 페이지로 이동
      if (request.query.id != undefined && request.query.id != ''){
          if (serverData['xmlData']['xml_minigame.ipf/'+request.query.id]!=undefined) {
              detailPage('xml_minigame.ipf/'+request.query.id, request, response);
          } else {
            loadXMLData('xml_minigame.ipf/'+request.query.id, 'xml_minigame.ipf/'+request.query.id+'.xml', function(){
                detailPage('xml_minigame.ipf/'+request.query.id, request, response);
            });
          }
          return;
      } else {
        response.send('no data');
      }
    });
  
    var layout_detail = fs.readFileSync('./web/MinigamePage/detail.html');
  
    function detailPage(id, request, response) {
        var missionData = serverData['xmlData'][id];
        if (missionData == undefined || missionData.root == undefined || missionData.root.children == undefined) {
            response.send('no data');
            return;
        }
     
        var flowString = '';
        for (var i = 0; i < missionData.root.children.length; i ++){
            flowString += '<h1>Game. '+(i+1)+'</h1>';
            flowString += '<p>'+missionData.root.children[i].attributes['Name']+'</p>';
            flowString += '<p>Lv.'+missionData.root.children[i].attributes['minLv']+'~'+missionData.root.children[i].attributes['maxLv']+'</p>';
            flowString += '<p>'+tos.GetMapString(serverData['tableData'],missionData.root.children[i].attributes['mapName'])+'</p>';
            if (missionData.root.children[i].children!=undefined && 
                missionData.root.children[i].children.length>0 && 
                missionData.root.children[i].children[0].name=="StageList"){
                var stagelist = missionData.root.children[i].children[0].children;
                if (stagelist != undefined){
                    flowString += '<div style="margin-left:20px;">';
                    for (var j=0;j<stagelist.length;j++){
                        flowString += '<h2>Stage. '+stagelist[j].attributes['Name']+'</h2>';
                        //StartScpList ObjList StageEvents
                        for (var k=0;k<stagelist[j].children.length;k++){
                            flowString += '<div style="margin-left:20px;">';
                            flowString += '<h3>'+stagelist[j].children[k].name+'</h3>';
                            switch(stagelist[j].children[k].name){
                                case 'StartScpList':
                                case 'CompleteScpList':{
                                    var scplist = stagelist[j].children[k].children;
                                    if (scplist == undefined) break;
                                    for (var l=0;l<scplist.length;l++){
                                        flowString += getScpString(scplist[l]);
                                        flowString += '<br>';
                                    }
                                }
                                break;
                                case 'ObjList':{
                                    var objlist = stagelist[j].children[k].children;
                                    if (objlist == undefined) break;
                                    for (var l=0;l<objlist.length;l++){
                                        var problist = [];
                                        if (objlist[l].attributes['propList']!=undefined && objlist[l].attributes['propList'].length>0){
                                            var probliststr = objlist[l].attributes['propList'].replace(/&apos;/g, '').split(' ');
                                            for (var m=0;(m+1)<probliststr.length;m+=2){
                                                problist[probliststr[m]]=probliststr[m+1];
                                            }
                                        }
                                        flowString += '<p>';
                                        if (problist['Name']!=undefined){
                                            flowString += problist['Name']+' ('+tos.GetMonsterString(serverData['tableData'],tos.ClassIDToClassName(serverData['tableData'],'monster',objlist[l].attributes['MonType']))+')';
                                        } else {
                                            flowString += tos.GetMonsterString(serverData['tableData'],tos.ClassIDToClassName(serverData['tableData'],'monster',objlist[l].attributes['MonType']));
                                        }
                                        if (problist['Dialog']!= undefined){
                                            flowString += ' '+tos.GetDialogString(serverData['tableData'],problist['Dialog'],'Dialog')
                                        }
                                        flowString += '</p>';
                                    }
                                }
                                break;
                                case 'StageEvents':{
                                    var eventlist = stagelist[j].children[k].children;
                                    if (eventlist==undefined) break;
                                    for (var l=0;l<eventlist.length;l++){
                                        flowString += '<p><b>Event. '+eventlist[l].attributes['eventName']+'</b></p>';
                                        flowString += '<div style="margin-left:20px;">';
                                        for (var m=0;m<eventlist[l].children.length;m++){
                                            flowString += '<p>'+eventlist[l].children[m].name+'</p>';
                                            for(var n=0;n<eventlist[l].children[m].children.length;n++){
                                                flowString += getScpString(eventlist[l].children[m].children[n]);
                                                flowString += '<br>';
                                            }
                                        }
                                        flowString += '</div><br>';
                                    }
                                }
                                break;
                            }
                            flowString += '</div>';
                            flowString += '<br><br>';
                        }
                    }
                    flowString += '</div>';
                    flowString += '<br><br>';
                }
            }
        }

        var output = layout_detail.toString();
        output = output.replace(/%PageTitle%/g, id);
        output = output.replace(/%ClassName%/g, id.replace('/','\n'));
        output = output.replace(/%FlowString%/g, flowString);
        response.send(output);
    }

    function loadXMLData(name, path, callback){
        // if (serverSetting['noDownload'] && fs.existsSync('./web/data/' + path)){
        //   // import
        //   fs.readFile('./web/data/' + path, function(error, data){
        //     serverData['xmlData'][name] = xml(data.toString());
        //     console.log('import xml [' + name + '] ' + path);
        //   });
        //   return;
        // }
        var file = fs.createWriteStream('./web/data/' + path);
        var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
          response.pipe(file).on('close', function(){
            console.log('downloaded xml [' + name + '] ' + path);
            if (fs.existsSync('./web/data/' + path) == false){
              console.log('not exist xml [' + name + '] ' + path);
              if (callback != undefined) callback();
              return;
            }
            //import
            fs.readFile('./web/data/' + path, function(error, data){
              serverData['xmlData'][name] = xml(data.toString());
              console.log('import xml [' + name + '] ' + path);
              if (callback != undefined) callback();
            });
          });
        }).on('error', (e) => {
          console.log('download error xml [' + name + '] ' + path + ' ' + e);
          if (callback != undefined) callback();
        });
      }
      

    function getScpString(data){
        var output = '';
        var arglist = [];
        for (var m=0;m<data.children.length;m++){
            switch(data.children[m].name){
                case 'Num':
                arglist.push(data.children[m].attributes['Num']);
                break;
                case 'Str':
                arglist.push('"'+data.children[m].attributes['Str']+'"');
                break;
            }
        }
        var argstr = '';
        for (var m=0;m<arglist.length;m++){
            if (m>0) argstr += ', ';
            argstr += arglist[m];
        }
        output += '<table><tbody>';
        output += '<tr><td>'+data.attributes['Scp']+'</td></tr>';
        output += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size:0.75em; white-space: pre-wrap;">'+argstr+'</td></tr>';
        output += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size:0.75em; white-space: pre-wrap;">'+serverData['scriptData'][data.attributes['Scp']]+'</td></tr>';
        output += '</tbody></table>';

        return output;
    }
  
    return route;
  }