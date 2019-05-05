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
          var skill_className = tos.ClassIDToClassName(serverData,'skill',request.query.id);
          if (serverData['xmlData']['xml.ipf/skill_bytool']!=undefined&&serverData['xmlData']['xml.ipf/skill_bytool'].root!=undefined) {
              for (var i=0;i<serverData['xmlData']['xml.ipf/skill_bytool'].root.children.length;i++){
                  if (serverData['xmlData']['xml.ipf/skill_bytool'].root.children[i]==undefined) continue;
                  if (serverData['xmlData']['xml.ipf/skill_bytool'].root.children[i].attributes['Name']==skill_className){
                    detailPage(serverData['xmlData']['xml.ipf/skill_bytool'].root.children[i], request, response);
                    return;
                  }
              }
          }
      }


      response.send('no data');
    });
  
    var layout_detail = fs.readFileSync('./web/MinigamePage/detail.html');
  
    function detailPage(skillData, request, response) {

        var skill_className = tos.ClassIDToClassName(serverData,'skill',request.query.id);
        var skill_Name = tos.FindDataClassName(serverData,'skill',skill_className).Name;
     
        var flowString = '';
        for (var i = 0; i < skillData.children.length; i ++){
            flowString += '<h2>'+skillData.children[i].name+'</h3>';
            flowString += '<div style="margin-left:20px;">';
            switch(skillData.children[i].name){
                case 'EnableScripts':{
                    for(var j=0;j<skillData.children[i].children.length;j++){
                        flowString += getScpString(skillData.children[i].children[j]);
                    }
                }
                break;
                case 'MainSkl':{
                    flowString += '<table><tbody>';
                    for (param in skillData.children[i].attributes){
                        flowString += '<tr><td>'+param+'</td><td>'+skillData.children[i].attributes[param]+'</td></tr>';
                    }
                    flowString += '</tbody></table><br>';
                    for(var j=0;j<skillData.children[i].children.length;j++){
                        flowString += '<h3>'+skillData.children[i].children[j].name+'</h3>';
                        flowString += '<div style="margin-left:20px;">';
                        switch(skillData.children[i].children[j].name){
                            case 'HitList':{
                                for(var k=0;k<skillData.children[i].children[j].children.length;k++){
                                    flowString += '<p>'+skillData.children[i].children[j].children[k].name+'</p>';
                                    flowString += '<table><tbody>';
                                    for (param in skillData.children[i].children[j].children[k].attributes){
                                        flowString += '<tr><td>'+param+'</td><td>'+skillData.children[i].children[j].children[k].attributes[param]+'</td></tr>';
                                    }
                                    flowString += '</tbody></table><br>';
                                }
                            }
                            break;
                            case 'EtcList':{
                                for(var k=0;k<skillData.children[i].children[j].children.length;k++){
                                    switch(skillData.children[i].children[j].children[k].name){
                                        case 'Anim':{
                                            flowString += '<table><tbody>';
                                            for (param in skillData.children[i].children[j].children[k].attributes){
                                                flowString += '<tr><td>'+param+'</td><td>'+skillData.children[i].children[j].children[k].attributes[param]+'</td></tr>';
                                            }
                                            flowString += '</tbody></table><br>';
                                        }
                                        break;
                                        case 'ToolScp':
                                        case 'Scp':{
                                            flowString += getScpString(skillData.children[i].children[j].children[k]);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                            case 'ResultList':{
                                for(var k=0;k<skillData.children[i].children[j].children.length;k++){
                                    switch(skillData.children[i].children[j].children[k].name){
                                        case 'ToolScp':
                                        case 'Scp':{
                                            flowString += getScpString(skillData.children[i].children[j].children[k]);
                                        }
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                        flowString += '</div>';
                    }
                }
                break;
                case 'ByCondSkills':{
                    for(var j=0;j<skillData.children[i].children.length;j++){
                        flowString += '<h3>'+skillData.children[i].children[j].name+'</h3>';
                        flowString += '<div style="margin-left:20px;">';
                        for(var k=0;k<skillData.children[i].children[j].children.length;k++){
                            var byCondSkillData = skillData.children[i].children[j].children[k];
                            flowString += '<h3>'+byCondSkillData.name+'</h3>';
                            flowString += '<div style="margin-left:20px;">';
                            switch(byCondSkillData.name){
                                case 'Cond':{
                                    for(var m=0;m<byCondSkillData.children.length;m++){
                                        switch(byCondSkillData.children[m].name){
                                            case 'ToolScp':
                                            case 'Scp':{
                                                flowString += getScpString(byCondSkillData.children[m]);
                                            }
                                            break;
                                        }
                                    }
                                }
                                break;
                                case 'Skill':{
                                    flowString += '<table><tbody>';
                                    for (param in byCondSkillData.attributes){
                                        flowString += '<tr><td>'+param+'</td><td>'+byCondSkillData.attributes[param]+'</td></tr>';
                                    }
                                    flowString += '</tbody></table><br>';
                                    for(var l=0;l<byCondSkillData.children.length;l++){
                                        flowString += '<h3>'+byCondSkillData.children[l].name+'</h3>';
                                        flowString += '<div style="margin-left:20px;">';
                                        switch(byCondSkillData.children[l].name){
                                            case 'HitList':{
                                                for(var m=0;m<byCondSkillData.children[l].children.length;m++){
                                                    flowString += '<p>'+byCondSkillData.children[l].children[m].name+'</p>';
                                                    flowString += '<table><tbody>';
                                                    for (param in byCondSkillData.children[l].children[m].attributes){
                                                        flowString += '<tr><td>'+param+'</td><td>'+byCondSkillData.children[l].children[m].attributes[param]+'</td></tr>';
                                                    }
                                                    flowString += '</tbody></table><br>';
                                                }
                                            }
                                            break;
                                            case 'EtcList':{
                                                for(var m=0;m<byCondSkillData.children[l].children.length;m++){
                                                    switch(byCondSkillData.children[l].children[m].name){
                                                        case 'Anim':{
                                                            flowString += '<table><tbody>';
                                                            for (param in byCondSkillData.children[l].children[m].attributes){
                                                                flowString += '<tr><td>'+param+'</td><td>'+byCondSkillData.children[l].children[m].attributes[param]+'</td></tr>';
                                                            }
                                                            flowString += '</tbody></table><br>';
                                                        }
                                                        break;
                                                        case 'ToolScp':
                                                        case 'Scp':{
                                                            flowString += getScpString(byCondSkillData.children[l].children[m]);
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            break;
                                            case 'ResultList':{
                                                for(var m=0;m<byCondSkillData.children[l].children.length;m++){
                                                    switch(byCondSkillData.children[l].children[m].name){
                                                        case 'ToolScp':
                                                        case 'Scp':{
                                                            flowString += getScpString(byCondSkillData.children[l].children[m]);
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                            break;
                                        }
                                        flowString += '</div>';
                                    }
                                    
                                }
                                break;
                            }
                        }
                        flowString += '</div>';
                    }
                }
                break;
            }
            flowString += '</div>';
        }

        var output = layout_detail.toString();
        output = output.replace(/%PageTitle%/g, skill_Name);
        output = output.replace(/%ClassName%/g, skill_className.replace('/','\n'));
        output = output.replace(/%FlowString%/g, flowString);
        response.send(output);
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
                case 'MonProp':
                arglist.push('"['+data.children[m].attributes['List']+']"');
                break;
            }
        }
        var argstr = '';
        for (var m=0;m<arglist.length;m++){
            if (m>0) argstr += ', ';
            argstr += arglist[m];
        }

        var script = serverData['scriptData'][data.attributes['Scp']];
        if (script == undefined) script = 'not found script.'

        output += '<table><tbody>';
        output += '<tr><td>'+data.attributes['Scp']+'</td></tr>';
        output += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size:0.75em; white-space: pre-wrap;">'+argstr+'</td></tr>';
        output += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size:0.75em; white-space: pre-wrap;">'+script+'</td></tr>';
        output += '</tbody></table>';

        return output;
    }
  
    return route;
  }