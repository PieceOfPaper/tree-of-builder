var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var session = require('express-session');

const { Pool, Client } = require('pg');
var mysql = require('mysql');
var mysqls = require('sync-mysql');
var mysql_import = require('mysql-import');

var csv = require('csv-parser');
var xml = require('xml-parser');
var bodyParser = require('body-parser')

var Slack = require('slack-node');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var tos = require('./my_modules/TosModule');
var dbLayout = require('./my_modules/DBLayoutModule');

// var nodelua = require('node-lua');
// var lua = new nodelua.LuaState();

var cmd=require('node-cmd');

var app = express();



var serverSetting = [];

serverSetting['webhookUri'] = 'https://hooks.slack.com/services/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';
serverSetting['dataServerPath'] = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/';
serverSetting['serverCode'] = 'kr';
serverSetting['isLocalServer'] = false;

serverSetting['noDownload'] = false;
serverSetting['slackOff'] = false;




slack = new Slack();
slack.setWebhook(serverSetting['webhookUri']);
function sendSlack(message){
  if (serverSetting['slackOff']) return;
  slack.webhook({
    channel: '#web-' + serverSetting['serverCode'],
    username: "webhookbot",
    text: message,
  }, function(err, response) { console.log(response); });
}

process.argv.forEach(function (val, index, array) {
  if (val != undefined){

    //option
    if (val == 'noDownload'){
      serverSetting['noDownload'] = true;
      console.log('No Downlaod');
    } else if (val == 'slackOff'){
      serverSetting['slackOff'] = true;
      console.log('Slack Off');

    //change server
    } else if (val == 'server-kr'){
      serverSetting['serverCode'] = 'kr';
      console.log('change server ' + serverSetting['serverCode']);
    } else if (val == 'server-ktest'){
      serverSetting['serverCode'] = 'ktest';
      console.log('change server ' + serverSetting['serverCode']);
    } else if (val == 'server-global'){
      serverSetting['serverCode'] = 'global';
      console.log('change server ' + serverSetting['serverCode']);
    } else if (val == 'server-local'){
      serverSetting['serverCode'] = 'ktest';
      serverSetting['isLocalServer'] = true;
      console.log('change server ' + serverSetting['serverCode']);
    }
  }
});
console.log('argument loaded');



console.log('### DB Connect Request');
serverSetting['dbconfig'] = undefined;
if (serverSetting['isLocalServer']){
  serverSetting['dbconfig'] = {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'localhost',
    database : 'tree-of-builder',
    onerror: err=>console.log(err.message),
  };
} else if(serverSetting['serverCode'] == 'kr') {
  serverSetting['dbconfig'] = {
    host     : 'remotemysql.com',
    user     : '8dsGgaueIQ',
    password : 'Mc95OQq01F',
    database : '8dsGgaueIQ',
    onerror: err=>console.log(err.message),
  };
}
// var dbimporter = mysql_import.config(serverSetting['dbconfig']);
// dbimporter.import('table_structure_dump.sql').then(()=> {
// 	console.log('### DB Setting Success.')
// });

serverSetting['db-testConnect'] = false;
if (serverSetting['dbconfig'] != undefined){
  var testConnection = mysql.createConnection(serverSetting['dbconfig']);
  testConnection.on('error', function() {});
  testConnection.connect(function(err) {
    if (err) {
      console.error('### DB Connect Error: ' + err.stack);
      return;
    }
    console.log('### DB Connect Success. connected as id ' + testConnection.threadId);
    serverSetting['db-testConnect'] = true;
    testConnection.end();
    DBImport(serverSetting['dbconfig']);
  });
  //connection.end();
}

function DBImport(dbconfig){
  var conns = new mysqls(dbconfig);

  var filelist = undefined;
  fs.readdir('./table_setting', (err, files) => {
    if (err) console.error(err);
    if (files === undefined || files.length == 0){
      console.log('no setting.')
      return;
    }
    filelist = files;
    import_db(0);
    //for (var i=0;i<files.length;i++){
    function import_db(i){
      if (i >= filelist.length) {
        if (conns!=undefined) conns.dispose();
        return;
      }
      var table_setting_file = fs.readFileSync('./table_setting/'+filelist[i]);
      var column_setting = table_setting_file.toString().split('\n');
      var tablename = filelist[i].split('.')[0];

      var conn = mysql.createConnection(dbconfig);
      conn.on('error', function() {});
      conn.connect();
      //console.log('[DB Import] Check Has Table : ' + tablename);
      conn.query('SELECT 1 FROM '+tablename+' LIMIT 1;', function (error, results, fields) {
        conn.end();
        if (error){
          //console.log('[DB Import] Check Has Table : ' + tablename + ' => NOT HAS');
          console.log('[DB Import] Create Table : ' + tablename);
          var querystr ='CREATE TABLE '+tablename+' (';
          for (var j=0;j<column_setting.length;j++){
            if (j>0) querystr +=', '
            querystr +=column_setting[j];
          }
          querystr +=');';
          conns.query(querystr);
        } else {
          //console.log('[DB Import] Check Has Table : ' + tablename + ' => HAS');
          for (var j=0;j<column_setting.length;j++){
            if (column_setting[j].trimLeft().startsWith('PRIMARY KEY')){
              //console.log('[DB Import] Add Primary Key : ' + tablename + ' ' + column_setting[j]);
              var keyname = column_setting[j].split('(')[1].split(')')[0].trim();
              conns.query('ALTER TABLE '+tablename+' DROP PRIMARY KEY;');
              conns.query('ALTER TABLE '+tablename+' ADD PRIMARY KEY ('+keyname+');');
              continue;
            }
            var hasColumn = conns.query('SHOW COLUMNS FROM '+tablename+' LIKE "'+column_setting[j].trimLeft().split(' ')[0]+'";');
            if (hasColumn!=undefined && hasColumn.length>0){
              //console.log('[DB Import] Update Column : ' + tablename + ' ' + column_setting[j]);
              conns.query('ALTER TABLE '+tablename+' MODIFY COLUMN '+column_setting[j]+';');
            } else {
              console.log('[DB Import] Add Column : ' + tablename + ' ' + column_setting[j]);
              conns.query('ALTER TABLE '+tablename+' ADD COLUMN '+column_setting[j]+';');
            }
          }
        }
        import_db(i + 1);
      });
    }
  });
}



if (!fs.existsSync('./web/data')) fs.mkdirSync('./web/data');
if (!fs.existsSync('./web/data/ies.ipf')) fs.mkdirSync('./web/data/ies.ipf');
if (!fs.existsSync('./web/data/ies_client.ipf')) fs.mkdirSync('./web/data/ies_client.ipf');
if (!fs.existsSync('./web/data/ies_ability.ipf')) fs.mkdirSync('./web/data/ies_ability.ipf');
if (!fs.existsSync('./web/data/ies_mongen.ipf')) fs.mkdirSync('./web/data/ies_mongen.ipf');
if (!fs.existsSync('./web/data/ies_mongen.ipf/SmartGen')) fs.mkdirSync('./web/data/ies_mongen.ipf/SmartGen');
if (!fs.existsSync('./web/data/xml.ipf')) fs.mkdirSync('./web/data/xml.ipf');
if (!fs.existsSync('./web/data/skill_bytool.ipf')) fs.mkdirSync('./web/data/skill_bytool.ipf');
if (!fs.existsSync('./web/data/xml_lang.ipf')) fs.mkdirSync('./web/data/xml_lang.ipf');
if (!fs.existsSync('./web/data/xml_minigame.ipf')) fs.mkdirSync('./web/data/xml_minigame.ipf');
if (!fs.existsSync('./web/lua')) fs.mkdirSync('./web/lua');


var serverData = [];
serverData['tableData'] = [];
serverData['xmlData'] = [];
serverData['scriptData'] = [];
serverData['imagePath'] = [];

// ---------- 파일리스트 데이터 불러오기
loadFilelist('ies_ability.ipf/filelist.txt', function(filelist){
  if (filelist==undefined) return;
  for (var i=0;i<filelist.length;i++){
    if (filelist[i]=='ies_ability.ipf/ability.ies') {
      filelist.splice(i, 1);
    } else if (filelist[i]=='ies_ability.ipf/filelist.txt') {
      filelist.splice(i, 1);
    }
  }
  loadTableList('ability_job',filelist);
});
loadFilelist('skill_bytool.ipf/filelist.txt', function(filelist){
  if (filelist==undefined) return;
  for (var i=0;i<filelist.length;i++){
    if (filelist[i]=='skill_bytool.ipf/filelist.txt') {
      filelist.splice(i, 1);
    }
  }
  loadXMLDataList('skill_bytool',filelist);
});
function loadFilelist(path, callback){
  if (serverSetting['noDownload'] && fs.existsSync('./web/data/' + path)){
    fs.readFile('./web/data/' + path, function(err, data){
      var filelist = data.toString().replace(/\\/g,'/').replace(/\r?\n|\r/g, '\n').split('\n');
      for (var i=0;i<filelist.length;i++){
        filelist[i]=filelist[i].split('Tree-of-IPF/'+serverSetting['serverCode']+'/')[1];
        if (filelist[i]==undefined||filelist[i].length==0) filelist.splice(i, 1);
      }
      if (callback != undefined) callback(filelist);
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  console.log('request download ' + path);
  var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('downloaded ' + path);
      if (fs.existsSync('./web/data/' + path) == false){
        console.log('not exist ' + path);
        if (callback != undefined) callback(undefined);
        return;
      }
      fs.readFile('./web/data/' + path, function(err, data){
        var filelist = data.toString().replace(/\\/g,'/').replace(/\r?\n|\r/g, '\n').split('\n');
        for (var i=0;i<filelist.length;i++){
          filelist[i]=filelist[i].split('Tree-of-IPF/'+serverSetting['serverCode']+'/')[1];
          if (filelist[i]==undefined||filelist[i].length==0) filelist.splice(i, 1);
        }
        if (callback != undefined) callback(filelist);
      });
    });
  }).on('error', (e) => {
    console.log('download error '+path+' ' + e);
    if (callback != undefined) callback(undefined);
  });
}

// ---------- 테이블 데이터 불러오기
loadTable('job', 'ies.ipf/job.ies', function(){
  loadTable('ability', 'ies_ability.ipf/ability.ies', function(){
    //loadTable('ability_job', 'ies_ability.ipf/ability_warrior.ies'); //Warrior만 소문자라 하드코딩;;
    // for (var i = 0; i < serverData['tableData']['job'].length; i ++){
    //   //if (serverData['tableData']['job'][i].EngName === 'Warrior') continue;
    //   loadTable('ability_job', 'ies_ability.ipf/ability_' + serverData['tableData']['job'][i].EngName + '.ies', function(name, path){
    //     if (serverData['tableData'][name] == undefined || serverData['tableData'][name].langth == 0){
    //       loadTable(name, path.toLowerCase());
    //     }
    //   });
    //   //loadXMLData('skill_bytool', 'xml.ipf/skill_bytool/'+serverData['tableData']['job'][i].EngName.toLowerCase()+'.xml');
    // }
    serverData['tableData']['job'].sort(function(a,b){
        if (tos.GetJobNumber1(a.ClassName) > tos.GetJobNumber1(b.ClassName)) return 1;
        else if (tos.GetJobNumber1(a.ClassName) < tos.GetJobNumber1(b.ClassName)) return -1;
        else {
            if (Number(a.Rank) > Number(b.Rank)) return 1;
            else if (Number(a.Rank) < Number(b.Rank)) return -1;
            else {
                if (Number(a.ClassID) > Number(b.ClassID)) return 1;
                else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
                else return 0;
            }
        }
    });
  });
});
loadTable('skill', 'ies.ipf/skill.ies', function(){
  loadTable('skill_mon', 'ies.ipf/skill_mon.ies', function(){
    for(var i=0;i<serverData['tableData']['skill_mon'].length;i++){
      serverData['tableData']['skill'].push(serverData['tableData']['skill_mon'][i]);
    }
    console.log('merge skill+skill_mon');
  });
  loadTable('skill_Simony', 'ies.ipf/skill_Simony.ies', function(){
    for(var i=0;i<serverData['tableData']['skill_Simony'].length;i++){
      for(var j=0;j<serverData['tableData']['skill'].length;j++){
        if(serverData['tableData']['skill'][j].ClassID==serverData['tableData']['skill_Simony'][i].ClassID){
          serverData['tableData']['skill'][j]['CanMakeSimony'] = serverData['tableData']['skill_Simony'][i].CanMake;
          break;
        }
      }
    }
    console.log('merge skill+simony');
  });
  loadTable('skilltree', 'ies.ipf/skilltree.ies', function(){
    for(var i=0;i<serverData['tableData']['skilltree'].length;i++){
      for(var j=0;j<serverData['tableData']['skill'].length;j++){
        if(serverData['tableData']['skill'][j].ClassName==serverData['tableData']['skilltree'][i].SkillName){
          serverData['tableData']['skill'][j]['SkillTree'] = serverData['tableData']['skilltree'][i].ClassName;
          break;
        }
      }
    }
    console.log('merge skill+skilltree');
  });
});
loadTable('HiddenAbility_Reinforce', 'ies.ipf/hiddenAbility_Reinforce.ies');
loadTable('dialogtext', 'ies_client.ipf/dialogtext.ies');
loadTable('skill_attribute', 'ies.ipf/skill_attribute.ies');
//loadTable('skill_Simony', 'ies.ipf/skill_Simony.ies');
loadTable('buff', 'ies.ipf/buff.ies', function(){
  loadTable('buff', 'ies.ipf/buff_contents.ies', function(){
    loadTable('buff', 'ies.ipf/buff_hardskill.ies', function(){
      loadTable('buff', 'ies.ipf/buff_mgame.ies', function(){
        loadTable('buff', 'ies.ipf/buff_monster.ies', function(){
          // serverData['tableData']['buff'].sort(function(a,b){
          //   if (Number(a.ClassID) > Number(b.ClassID)) return 1;
          //   else if (Number(a.ClassID) < Number(b.ClassID)) return -1;
          //   else return 0;
          // });
        });
      });
    });
  });
});
loadTable('stance', 'ies.ipf/stance.ies');
loadTable('cooldown', 'ies.ipf/cooldown.ies');
loadTable('item_grade', 'ies.ipf/item_grade.ies');
loadTable('item', 'ies.ipf/item.ies', function(){
  loadTable('item_Equip', 'ies.ipf/item_Equip.ies', function(){
    for (param in serverData['tableData']['item_Equip']) serverData['tableData']['item'].push(serverData['tableData']['item_Equip'][param]);
    loadTable('item_Quest', 'ies.ipf/item_Quest.ies', function(){
      for (param in serverData['tableData']['item_Quest']) serverData['tableData']['item'].push(serverData['tableData']['item_Quest'][param]);
      loadTable('item_gem', 'ies.ipf/item_gem.ies', function(){ 
        for (param in serverData['tableData']['item_gem']) serverData['tableData']['item'].push(serverData['tableData']['item_gem'][param]);
        loadTable('item_premium', 'ies.ipf/item_premium.ies', function(){  
          for (param in serverData['tableData']['item_premium']) serverData['tableData']['item'].push(serverData['tableData']['item_premium'][param]);
          loadTable('item_recipe', 'ies.ipf/wiki_recipe.ies', function(){  
            for (param in serverData['tableData']['item_recipe']) serverData['tableData']['item'].push(serverData['tableData']['item_recipe'][param]);
          });
        });
      });
    });
  });
});
loadTable('recipe', 'ies.ipf/recipe.ies');
loadTable('item_equip_classtype', 'ies.ipf/item_equip_classtype.ies');
loadTable('item_equip_default', 'ies.ipf/item_equip_default.ies');
loadTable('setitem', 'ies.ipf/setitem.ies');
loadTable('legend_recipe', 'ies.ipf/legend_recipe.ies');
loadTable('legend_setitem', 'ies.ipf/legend_setitem.ies');
loadTable('item_seal_option', 'ies.ipf/item_seal_option.ies');
loadTable('monster', 'ies.ipf/monster.ies', function(){
  loadTable('monster', 'ies.ipf/monster_event.ies', function(){
    loadTable('monster', 'ies.ipf/monster_guild.ies', function(){
      loadTable('monster', 'ies.ipf/monster_item.ies', function(){
        loadTable('monster', 'ies.ipf/monster_item_summon.ies', function(){
          loadTable('monster', 'ies.ipf/monster_mgame.ies', function(){
            loadTable('monster', 'ies.ipf/monster_npc.ies', function(){
              loadTable('monster', 'ies.ipf/monster_pet.ies', function(){
                loadTable('monster', 'ies.ipf/monster_sends.ies', function(){
                });
              });
            });
          });
        });
      });
    });
  });
});
loadTable('statbase_monster', 'ies.ipf/statbase_monster.ies');
loadTable('statbase_monster_race', 'ies.ipf/statbase_monster_race.ies');
loadTable('statbase_monster_type', 'ies.ipf/statbase_monster_type.ies');
loadTable('questprogresscheck', 'ies.ipf/questprogresscheck.ies');
loadTable('questprogresscheck_auto', 'ies.ipf/questprogresscheck_auto.ies');
loadTable('questprogressnpc', 'ies.ipf/questprogressnpc.ies');
loadTable('map2', 'ies.ipf/map.ies', function(){
  loadTable('camp_warp', 'ies.ipf/camp_warp.ies', function(){
    for (param in serverData['tableData']['camp_warp']){
      var mapdata = tos.FindDataClassName(serverData,'map2',serverData['tableData']['camp_warp'][param].Zone);
      if (mapdata != undefined){
        mapdata['CanCampWarp']=true;
      }
    }
  });
  for (param in serverData['tableData']['map2']){
    // loadTable('Anchor_'+serverData['tableData']['map2'][param].ClassName, 'ies_mongen.ipf/Anchor_'+serverData['tableData']['map2'][param].ClassName+'.ies');
    // loadTable('Anchor_'+serverData['tableData']['map2'][param].ClassName, 'ies_mongen.ipf/anchor_'+serverData['tableData']['map2'][param].ClassName+'.ies');
    loadTable('GenType_'+serverData['tableData']['map2'][param].ClassName, 'ies_mongen.ipf/GenType_'+serverData['tableData']['map2'][param].ClassName+'.ies', function(name, path){
      if (serverData['tableData'][name] == undefined || serverData['tableData'][name].langth == 0){
        loadTable(name, path.replace('GenType_','gentype_'));
      }
    });
    // loadTable('smartgen_'+serverData['tableData']['map2'][param].ClassName, 'ies_mongen.ipf/SmartGen/Smartgen_'+serverData['tableData']['map2'][param].ClassName+'.ies');
    // loadTable('smartgen_'+serverData['tableData']['map2'][param].ClassName, 'ies_mongen.ipf/SmartGen/smartgen_'+serverData['tableData']['map2'][param].ClassName+'.ies');
  }
});
loadTable('guild_event', 'ies.ipf/guild_event.ies');
loadTable('companion', 'ies.ipf/companion.ies');
loadTable('foodtable', 'ies.ipf/foodtable.ies');
loadTable('indun', 'ies.ipf/indun.ies');
loadTable('indun_reward_item', 'ies.ipf/indun_reward_item.ies');
loadTable('reward_indun', 'ies.ipf/reward_indun.ies');
loadTable('shop', 'ies.ipf/shop.ies');
loadTable('event_banner', 'ies_client.ipf/event_banner.ies');
loadTable('job_ballenceReward', 'ies.ipf/job_ballenceReward.ies');
loadTable('collection', 'ies.ipf/collection.ies', function(name, path){
  for (param in serverData['tableData']['collection']){
    if (serverData['tableData']['collection'][param]['PropList']!=undefined && serverData['tableData']['collection'][param]['PropList'].length>0){
      var probsplited = serverData['tableData']['collection'][param]['PropList'].split('/');
      for (var i=0;i<probsplited.length;i+=2){
        serverData['tableData']['collection'][param][probsplited[i]] = Number(probsplited[i+1]);
      }
    }
    if (serverData['tableData']['collection'][param]['AccPropList']!=undefined && serverData['tableData']['collection'][param]['AccPropList'].length>0){
      var probsplited = serverData['tableData']['collection'][param]['AccPropList'].split('/');
      for (var i=0;i<probsplited.length;i+=2){
        serverData['tableData']['collection'][param][probsplited[i]] = Number(probsplited[i+1]);
      }
    }
  }
});
loadTable('gacha_detail', 'ies.ipf/gacha_detail.ies');
loadTable('Package_Item_List', 'ies.ipf/Package_Item_List.ies');
loadTable('reward_property', 'ies.ipf/reward_property.ies');
loadTable('socketprice', 'ies.ipf/socketprice.ies');
function loadTable(name, path, callback, tryCnt){
  if (tryCnt == undefined) tryCnt = 1;
  if (serverData['tableData'][name] === undefined) serverData['tableData'][name] = [];
  if (serverSetting['noDownload'] && fs.existsSync('./web/data/' + path)){
    fs.createReadStream('./web/data/' + path).pipe(csv()).on('data', function (data) {
      data['TableName'] = name;
      for(var param in data){
        if (data[param] == undefined) continue;
        if (data[param].toLowerCase().indexOf('true') >= 0 || data[param].toLowerCase().indexOf('false') >= 0){
          continue;
        } else if (Number(data[param]).toString() != "NaN" && (Number(data[param]).toString().length == data[param].length || data[param].indexOf('\.') > 0)){
          data[param] = Number(data[param]);
        }
      }
      serverData['tableData'][name].push(data);
    }).on('end', function(){
      //console.log('import table [' + name + ']' + serverData['tableData'][name].length + ' ' + path);
      if (callback != undefined) callback(name, path);
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  //console.log('request download table [' + name + '] ' + path);
  var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      //console.log('downloaded table [' + name + '] ' + path);
      if (fs.existsSync('./web/data/' + path) == false){
        console.log('not exist table [' + name + '] ' + path);
        if (callback != undefined) callback(name, path);
        return;
      }
      fs.createReadStream('./web/data/' + path).pipe(csv()).on('data', function (data) {
        data['TableName'] = name;
        for(var param in data){
          if (data[param] == undefined) continue;
          if (data[param].toLowerCase().indexOf('true') >= 0 || data[param].toLowerCase().indexOf('false') >= 0){
            continue;
          } else if (Number(data[param]).toString() != "NaN" && (Number(data[param]).toString().length == data[param].length  || data[param].indexOf('\.') > 0)){
            data[param] = Number(data[param]);
          }
        }
        serverData['tableData'][name].push(data);
      }).on('end', function(){
        //console.log('import table [' + name + ']' + serverData['tableData'][name].length + ' ' + path);
        if (callback != undefined) callback(name, path);
      });
    });
  }).on('error', (e) => {
    if (tryCnt<3){
      console.warn('retry download table ('+tryCnt+') [' + name + '] ' + path);
      loadTable(name,path,callback, tryCnt+1);
    } else {
      console.error('download error table [' + name + '] ' + path + ' ' + e);
      if (callback != undefined) callback(name, path);
    }
  });
}
function loadTableList(name, pathlist, callback, index){
  if (pathlist==undefined) return;
  if (index==undefined) index=0;
  if (index>=pathlist.length) {
    if (callback!=undefined) callback();
    return;
  }
  //onsole.log(index+'/'+pathlist.length+' '+pathlist[index]);
  loadTable(name,pathlist[index],function(name,path){
    loadTableList(name,pathlist,callback,index+1);
  });
}


// ---------- XML 데이터 불러오기
//loadXMLData('xml_minigame.ipf/GM_WHITETREES_56_1', 'xml_minigame.ipf/GM_WHITETREES_56_1.xml');
loadXMLData('xml.ipf/playlist', 'xml.ipf/playlist.xml');
//loadXMLData('skill_bytool', 'xml.ipf/skill_bytool.xml');
//loadXMLData('xml.ipf/pad_skill_list', 'xml.ipf/pad_skill_list.xml');
function loadXMLData(name, path, callback, tryCnt){
  if (tryCnt == undefined) tryCnt = 1;
  if (serverSetting['noDownload'] && fs.existsSync('./web/data/' + path)){
    // import
    fs.readFile('./web/data/' + path, function(error, data){
      var fullstr = data.toString('utf8');
      if (fullstr.indexOf('<?xml') < 0){
        fullstr = '<?xml version="1.0" encoding="UTF-8"?>' + fullstr;
      }

      var newXML = xml(fullstr);
      if (serverData['xmlData'][name]!=undefined&&serverData['xmlData'][name].root!=undefined&&serverData['xmlData'][name].root.children!=undefined){
        if (newXML.root!=undefined&&newXML.root.children!=undefined){
          for (var i=0;i<newXML.root.children.length;i++){
            serverData['xmlData'][name].root.children.push(newXML.root.children[i]);
          }
        }
      }
      else {
        serverData['xmlData'][name] = newXML;
      }
      //console.log('import xml [' + name + '] ' + path);
      if (callback!=undefined) callback(name,path);
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      //console.log('downloaded xml [' + name + '] ' + path);
      if (fs.existsSync('./web/data/' + path) == false){
        console.error('not exist xml [' + name + '] ' + path);
        return;
      }
      //import
      fs.readFile('./web/data/' + path, function(error, data){
        var fullstr = data.toString('utf8');
        fullstr = fullstr.replace(/\r?\n|\r/g, " ");
        if (fullstr.indexOf('<?xml') < 0){
          fullstr = '<?xml version="1.0" encoding="UTF-8"?>' + fullstr;
        }

        var newXML = xml(fullstr);
        if (serverData['xmlData'][name]!=undefined&&serverData['xmlData'][name].root!=undefined&&serverData['xmlData'][name].root.children!=undefined){
          if (newXML.root!=undefined&&newXML.root.children!=undefined){
            for (var i=0;i<newXML.root.children.length;i++){
              serverData['xmlData'][name].root.children.push(newXML.root.children[i]);
            }
          }
        }
        else {
          serverData['xmlData'][name] = newXML;
        }
        //console.log('import xml [' + name + '] ' + path);
        if (callback!=undefined) callback(name,path);
      });
    });
  }).on('error', (e) => {
    if (tryCnt<3){
      console.warn('retry download xml ('+tryCnt+') [' + name + '] ' + path);
      loadXMLData(name,path,callback, tryCnt+1);
    } else {
      console.error('download error xml [' + name + '] ' + path + ' ' + e);
      if (callback != undefined) callback(name, path);
    }
  });
}
function loadXMLDataList(name, pathlist, callback, index){
  if (pathlist==undefined) return;
  if (index==undefined) index=0;
  if (index>=pathlist.length) {
    if (callback!=undefined) callback();
    return;
  }
  loadXMLData(name,pathlist[index],function(name,path){
    loadXMLDataList(name,pathlist,callback,index+1);
  });
}

importImage('ui.ipf/baseskinset/classicon.xml', function(){
  importImage('ui.ipf/baseskinset/skillicon.xml', function(){
    importImage('ui.ipf/baseskinset/monillust.xml', function(){
      importImage('ui.ipf/baseskinset/mongem.xml', function(){
        importImage('ui.ipf/baseskinset/itemicon.xml', function(){
          importImage('ui.ipf/baseskinset/eventbanner.xml', function(){
            importImage('ui.ipf/baseskinset/helpimage.xml', function(){
              importImage('ui.ipf/baseskinset/baseskinset.xml', function(){
                // var count = 0;
                // for (param in serverData['imagePath']){ count ++; }
                // console.log('imagePath ' + count);
              });
            });
          });
        });
      });
    });
  });
});
function importImage(srcPath, callback){
  autoMkDir('./web/data/' + srcPath);
  var file = fs.createWriteStream('./web/data/' + srcPath);
  var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + srcPath, function(response) {
    response.pipe(file).on('close', function(){
      //console.log('download ' + srcPath);
      //fs.createReadStream('./web/data/' + srcPath).on('data', function (data) {
      fs.readFile('./web/data/' + srcPath, function(error, data){
        //console.log(data.toString());
        var xmlTemp = xml(data.toString());
        
        if (xmlTemp.root === undefined || xmlTemp.root.children === undefined)
          return;
        
        for (var i = 0; i < xmlTemp.root.children.length; i ++){
          for (var j = 0; j < xmlTemp.root.children[i].children.length; j ++){
            if (xmlTemp.root.children[i].name.indexOf('skinlist') > -1){
              continue;
            } else {
              var data = [];
              if (xmlTemp.root.children[i].attributes['category'] != undefined){
                data['category'] = xmlTemp.root.children[i].attributes['category'];
              }
              if (xmlTemp.root.children[i].children[j].attributes['name'] === undefined) continue;
              if (xmlTemp.root.children[i].children[j].attributes['file'] === undefined) continue;
              data['path'] = serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/ui.ipf';
              var path = xmlTemp.root.children[i].children[j].attributes['file'].replace(/\\/g,'/');
              if (path.startsWith('/') == false) data['path'] += '/';
              data['path'] += path;
              data['imgrect'] = xmlTemp.root.children[i].children[j].attributes['imgrect'];
              serverData['imagePath'][xmlTemp.root.children[i].children[j].attributes['name'].toString().toLowerCase()] = data;
            }
          }
        }
        if (callback != undefined) callback();
      });
    });
  });
}



// ---------- 스크립트 데이터 불러오기
var scriptArray = [];
scriptArray.push('shared.ipf/script/calc_property_skill.lua');
scriptArray.push('shared.ipf/script/ability.lua');
scriptArray.push('shared.ipf/script/ability_price.lua');
scriptArray.push('shared.ipf/script/ability_unlock.lua');
scriptArray.push('shared.ipf/script/item_calculate.lua');
scriptArray.push('shared.ipf/script/item_transcend_shared.lua');
scriptArray.push('shared.ipf/script/lib_reinforce_131014.lua');
scriptArray.push('shared.ipf/script/calc_pvp_item.lua');
scriptArray.push('shared.ipf/script/calc_property_monster.lua');
scriptArray.push('shared.ipf/script/sharedscript.lua');
scriptArray.push('shared.ipf/script/colony_tax_shared_lib.lua');
scriptArray.push('script.ipf/buff/buff_monster_ability.lua');
scriptArray.push('script.ipf/buff/colonywar_buff.lua');
scriptArray.push('script.ipf/buff/etc_buff.lua');
scriptArray.push('script.ipf/buff/item_buff.lua');
scriptArray.push('script.ipf/buff/quest_buff.lua');
scriptArray.push('script.ipf/buff/raid_buff_hardcode.lua');
scriptArray.push('script.ipf/buff/skill_buff_addcheckon.lua');
scriptArray.push('script.ipf/buff/skill_buff_aftercalc.lua');
scriptArray.push('script.ipf/buff/skill_buff_deadcalc.lua');
scriptArray.push('script.ipf/buff/skill_buff_givedamage.lua');
scriptArray.push('script.ipf/buff/skill_buff_monster.lua');
scriptArray.push('script.ipf/buff/skill_buff_monster_ratetable.lua');
scriptArray.push('script.ipf/buff/skill_buff_pc.lua');
scriptArray.push('script.ipf/buff/skill_buff_ratetable.lua');
scriptArray.push('script.ipf/buff/skill_buff_takedamage.lua');
scriptArray.push('script.ipf/buff/skill_buff_useskill.lua');
scriptArray.push('script.ipf/skill/monskl_enable.lua');
scriptArray.push('script.ipf/skill/monskl_custom_hard.lua');
scriptArray.push('script.ipf/skill/monskl_custom.lua');
scriptArray.push('script.ipf/skill/monskl_result.lua');
scriptArray.push('script.ipf/skill/skill_select_by_cond.lua');
scriptArray.push('script.ipf/mgame/mgame.lua');
scriptArray.push('script_client.ipf/reaction/reaction.lua');
scriptArray.push('ui.ipf/uiscp/mgame_action.lua');
scriptArray.push('ui.ipf/uiscp/game.lua');
//for (var i = 0; i < scriptArray.length; i ++) loadScript(scriptArray[i]);
generateLuaScript(scriptArray, 0, function(result){
  // 기존 데이터 저장
  var lines = result.toString().split('\n');
  var clearedResult = '';
  var clearedResultTrim = ''; //간혹 깨진 문자열이 끼이는데, Trim으로 해결 가능
  for (var i=0;i<lines.length;i++){
    if (lines[i].trim().length==0) continue;
    if (lines[i].trim().indexOf('--[')<0 && (lines[i].trim().indexOf('--')==0 || lines[i].trim().indexOf('--')==1)) continue;
    if (clearedResult.length>0) clearedResult += '\n';
    if (clearedResultTrim.length>0) clearedResultTrim += '\n';
    clearedResult += lines[i];
    clearedResultTrim += lines[i].trim();
  }
  clearedResult = clearedResult.replace(/�/g,''); //깨진 문자열
  var luaFuncSplit = clearedResult.split('function');
  for (var i = 0; i < luaFuncSplit.length; i ++){
    var methodName = luaFuncSplit[i].split('(')[0].trim();
    serverData['scriptData'][methodName] = 'function' + luaFuncSplit[i];
  }
  // 파일로 저장
  fs.writeFile('./web/js/generated_lua.lua', clearedResultTrim, function(err) {
      if(err) return console.log(err);
      console.log('Success Generate Lua Scripts');
      //lua.DoString(clearedResultTrim);
      //cmd.run('./web/js/luajs/lua2js ./web/js/generated_lua.lua ./web/js/generated_lua.js')
  }); 
});
function generateLuaScript(array, index, callback){
  if (index >= array.length) {
    callback('');
    return;
  }

  var luaString = '';

  var pathSplited = array[index].split('/');
  var filename = pathSplited[pathSplited.length - 1];
  if (serverSetting['noDownload'] && fs.existsSync('./web/lua/' + filename)){
    fs.readFile('./web/lua/' + filename, function(err, data){
      if (err) {
        sendSlack(err.toString());
        generateLuaScript(array, index + 1, function(result){
          callback(result);
        });
        return;
      }
      luaString = data.toString();
      //console.log('import script [' + filename + ']');
      generateLuaScript(array, index + 1, function(result){
        callback(luaString + '\n' + result);
      });
    });
  } else {
    var file = fs.createWriteStream('./web/lua/' + filename);
    var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + array[index], function(response) {
      response.pipe(file).on('close', function(){
        //console.log('download script [' + filename + ']');
        fs.readFile('./web/lua/' + filename, function(err, data){
          if (err) {
            sendSlack(err.toString());
            generateLuaScript(array, index + 1, function(result){
              callback(result);
            });
            return;
          }
          luaString = data.toString();
          generateLuaScript(array, index + 1, function(result){
            callback(luaString + '\n' + result);
          });
        });
      });
    });
  }
}


// ---------- 언어데이터 불러와보기
loadTableLanguage('language', 'xml_lang.ipf/clientmessage.xml', function(){
  var languageJs = '';

  var data = {};
  for (param in serverData['tableData']['language']){
    data[param] = serverData['tableData']['language'][param];
  }
  
  languageJs += 'var languageData='+JSON.stringify(data)+';\n';
  languageJs += 'function getLanguageByClassName(className){'
  languageJs +=   'if (className==undefined) return className;';
  languageJs +=   'className=className.toString();';
  languageJs +=   'if (className.trim().length==0) return className;';
  languageJs +=   'if (languageData[className]==undefined) return className;';
  languageJs +=   'if (languageData[className].length==0) return className;';
  languageJs +=   'return languageData[className];';
  languageJs += '}';

  fs.writeFile('./web/js/language.js', languageJs, function(err) {
    if (err) sendSlack(err.toString());
    console.log('success write language.js file');
  }); 
});
function loadTableLanguage(name, path, callback){
  if (serverData['tableData'][name] === undefined) serverData['tableData'][name] = [];
  if (serverSetting['noDownload'] && fs.existsSync('./web/data/' + path)){
    fs.readFile('./web/data/' + path, function(error, data){
      if (error) sendSlack(err.toString());
      var xmlTemp = xml(data.toString());
      if (xmlTemp.root === undefined || xmlTemp.root.children === undefined)
        return;
      for (var i = 0; i < xmlTemp.root.children.length; i ++){
        for (var j = 0; j < xmlTemp.root.children[i].children.length; j ++){
          if (xmlTemp.root.children[i].children[j].attributes['ClassName'] == undefined) continue;
          serverData['tableData'][name][xmlTemp.root.children[i].children[j].attributes['ClassName']] = xmlTemp.root.children[i].children[j].attributes['Data'];
        }
      }
      //console.log('import table [' + name + '] ' + path);
      if (callback != undefined){
        callback();
      }
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  var request = https.get(serverSetting['dataServerPath'] + serverSetting['serverCode'] + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      //console.log('download table [' + name + '] ' + path);
      fs.readFile('./web/data/' + path, function(error, data){
        if (error) sendSlack(err.toString());
        var xmlTemp = xml(data.toString());
        if (xmlTemp.root === undefined || xmlTemp.root.children === undefined)
          return;
        for (var i = 0; i < xmlTemp.root.children.length; i ++){
          for (var j = 0; j < xmlTemp.root.children[i].children.length; j ++){
            if (xmlTemp.root.children[i].children[j].attributes['ClassName'] == undefined) continue;
            serverData['tableData'][name][xmlTemp.root.children[i].children[j].attributes['ClassName']] = xmlTemp.root.children[i].children[j].attributes['Data'];
          }
        }
        if (callback != undefined){
          callback();
        }
      });
    });
  });
}

// ---------- 페이지 세팅
app.use(express.static('web'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
  secret: 'ekdtlsdmfdnlgkdu',
  resave: false,
  saveUninitialized: true
}));

var layout = fs.readFileSync('./web/Layout/index-main.html');
var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');
 
app.get('/', function (req, response) {

    var serverName = '';
    switch(serverSetting['serverCode']){
      case 'kr':
      serverName = 'Korea';
      break;
      case 'ktest':
      serverName = 'Korea Test';
      break;
    }



    var output = layout.toString();
    output = output.replace(/style.css/g, '../style.css');
    // output = output.replace(/%IllustPath%/g, '../img/Dlg_portrait/' + files[randomIndex]);
    // output = output.replace(/%IllustName%/g, illustNpcName);
    // output = output.replace(/%IllustMention%/g, illustNpcText);
    output = output.replace(/%ServerName%/g, serverName);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());



    if (serverSetting['dbconfig'] == undefined) {
      output = output.replace(/%LoginData%/g, '');
      output = output.replace(/%ShortBoard%/g, '');
    } else {
      var connection = new mysqls(serverSetting['dbconfig']);
      var comment_results = connection.query('SELECT * FROM comment WHERE state=0 ORDER BY time DESC LIMIT 10;');
      if (comment_results != undefined){
        for (param in comment_results){
          var nickname_results = connection.query('SELECT * FROM user WHERE userno="'+comment_results[param].userno+'";');
          if (nickname_results!=undefined && nickname_results.length>0){
            comment_results[param]["nickname"]=nickname_results[0].nickname;
          }
        }
      }
      if (req.session.login_userno == undefined){
        output = output.replace(/%LoginData%/g, dbLayout.Layout_LoginForm());
        output = output.replace(/%ShortBoard%/g, dbLayout.Layout_CommentAll(serverData,undefined,comment_results));
      } else {
        var user_results = connection.query('SELECT * FROM user WHERE userno="'+req.session.login_userno+'";');
        output = output.replace(/%LoginData%/g, dbLayout.Layout_LogedIn(user_results[0]));
        output = output.replace(/%ShortBoard%/g, dbLayout.Layout_CommentAll(serverData,user_results[0],comment_results));
      }
      connection.dispose();
    }

    response.send(output);
  //})
});

// app.post('/Lua', function (req, res) {
//   var method = req.body.method;
//   //console.log(req.body);

//   if (method == undefined){
//     res.setHeader('Content-Type', 'application/json');
//     res.send(undefined);
//     return;
//   }
  
//   var argStr = '';
//   for(var i = 1; ;i ++){
//     if (req.body['arg' + i] == undefined) break;
//     if (i > 1) argStr += ',';
//     argStr += req.body['arg' + i];
//   }

//   lua.SetGlobal('builderResult');
//   lua.DoString('builderResult=' + method + '(' + argStr + ')');
//   lua.GetGlobal('builderResult');
  
//   var result = lua.ToValue(-1);
  
//   res.setHeader('Content-Type', 'application/json');
//   res.send(result);
// });

var debugPage = require('./web_script/web_debug')(app, serverSetting, serverData);
app.use('/%EC%97%B4%EB%A0%A4%EB%9D%BC%EC%B0%B8%EA%B9%A8', debugPage);

var dataServer = require('./data_server/data_server')(app, serverSetting, serverData);
app.use('/data', dataServer);

var boardFree = require('./board_server/board_free')(app, serverSetting);
app.use('/BoardFree', boardFree);

var skillPage = require('./web_script/web_skill')(app, serverSetting, serverData);
app.use('/Skill', skillPage);

var skillXMLPage = require('./web_script/web_skillxml')(app, serverSetting, serverData);
app.use('/SkillXML', skillXMLPage);

var abilityPage = require('./web_script/web_ability')(app, serverSetting, serverData);
app.use('/Ability', abilityPage);

var buffPage = require('./web_script/web_buff')(app, serverSetting, serverData);
app.use('/Buff', buffPage);

var itemPage = require('./web_script/web_item')(app, serverSetting, serverData);
app.use('/Item', itemPage);

var monsterPage = require('./web_script/web_monster')(app, serverSetting, serverData);
app.use('/Monster', monsterPage);

var questPage = require('./web_script/web_quest')(app, serverSetting, serverData);
app.use('/Quest', questPage);

var mapPage = require('./web_script/web_map')(app, serverSetting, serverData);
app.use('/Map', mapPage);

var dialogPage = require('./web_script/web_dialog')(app, serverSetting, serverData);
app.use('/Dialog', dialogPage);

var indunPage = require('./web_script/web_indun')(app, serverSetting, serverData);
app.use('/Indun', indunPage);

var collectionPage = require('./web_script/web_collection')(app, serverSetting, serverData);
app.use('/Collection', collectionPage);

var minigamePage = require('./web_script/web_minigame')(app, serverSetting, serverData);
app.use('/Minigame', minigamePage);

var minigamePage = require('./web_script/web_minigame')(app, serverSetting, serverData);
app.use('/Minigame', minigamePage);

var miscGuildEventPage = require('./web_script/web_misc_guildevent')(app, serverSetting, serverData);
app.use('/GuildEvent', miscGuildEventPage);

var miscCompanionPage = require('./web_script/web_misc_companion')(app, serverSetting, serverData);
app.use('/Companion', miscCompanionPage);

var miscEventbannerPage = require('./web_script/web_misc_eventbanner')(app, serverSetting, serverData);
app.use('/EventBanner', miscEventbannerPage);

var miscShopPage = require('./web_script/web_misc_shop')(app, serverSetting, serverData);
app.use('/Shop', miscShopPage);

var miscBallenceReward = require('./web_script/web_misc_ballenceReward')(app, serverSetting, serverData);
app.use('/BallenceReward', miscBallenceReward);

var builderPage = require('./web_script/web_builder')(app, serverSetting, serverData);
app.use('/Builder', builderPage);

var toolQuestCalcPage = require('./web_script/web_tool_questcalculator')(app, serverSetting, serverData);
app.use('/QuestCalculator', toolQuestCalcPage);

var toolFoodCalcPage = require('./web_script/web_tool_foodcalculator')(app, serverSetting, serverData);
app.use('/FoodCalculator', toolFoodCalcPage);

// var db_loginPage = require('./web_script/DBPage/web_login')(app, serverSetting, serverData['tableData'], serverData['scriptData']);
// app.use('/Login', db_loginPage);

// var db_logoutPage = require('./web_script/DBPage/web_logout')(app, serverSetting, serverData['tableData'], serverData['scriptData']);
// app.use('/Logout', db_logoutPage);

// var db_joinPage = require('./web_script/DBPage/web_join')(app, serverSetting, serverData['tableData'], serverData['scriptData']);
// app.use('/Join', db_joinPage);

var db_reqJoinMailPage = require('./web_script/DBPage/web_reqJoinMail')(app, serverSetting, serverData);
app.use('/ReqJoinMail', db_reqJoinMailPage);

// var db_emailAuthPage = require('./web_script/DBPage/web_emailAuth')(app, serverSetting, serverData['tableData'], serverData['scriptData']);
// app.use('/EmailAuth', db_emailAuthPage);

var db_accountPage = require('./web_script/DBPage/web_account')(app, serverSetting, serverData);
app.use('/Account', db_accountPage);

var db_boardShortPage = require('./web_script/DBPage/web_boardShort')(app, serverSetting, serverData);
app.use('/BoardShort', db_boardShortPage);

var db_commentPage = require('./web_script/DBPage/web_comment')(app, serverSetting, serverData);
app.use('/Comment', db_commentPage);

// var testPage = require('./web_script/web_test')(app, serverData['tableData']);
// app.use('/Test', testPage);



// ---------- ON!
// app.listen(port, function (){
//   console.log("Server Open! port:" + port);
// });
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

var http_port = 3000;
var https_port = 3000;

httpServer.listen(http_port, function (){
  console.log("Http Server Open! port:" + http_port);
  sendSlack("Http Server Open! port:" + http_port);
});
// httpsServer.listen(https_port, function (){
//   console.log("Https Server Open! port:" + https_port);
// });









function pathMerge(pathA, pathB){
  if (pathA === undefined || pathA.length === 0)
    return pathB;
  else if (pathB === undefined || pathB.length === 0)
      return pathA;

  pathA = pathA.replace(/\\/g, '/');
  pathB = pathB.replace(/\\/g, '/');
  if (pathA[0] === '/') pathA = pathA.substring(1, pathA.length)
  if (pathB[0] === '/') pathB = pathB.substring(1, pathB.length)
  if (pathA[pathA.length - 1] === '/') pathA = pathA.substring(0, pathA.length - 1)
  if (pathB[pathB.length - 1] === '/') pathB = pathB.substring(0, pathB.length - 1)

  return pathA + '/' + pathB;
}

function removeFileName(filepath){
  if (filepath === undefined || filepath.length === 0)
    return filepath;

    filepath = filepath.replace(/\\/g, '/');
  var splited = filepath.split('/');
  var lastDir = splited[splited.length - 1];
  if (lastDir.indexOf('.') > -1){
    return filepath.substring(0, filepath.length - lastDir.length);
  }
  return filepath;
}

function autoMkDir(filepath){
  if (filepath === undefined || filepath.length === 0)
    return;

  var dirPath = removeFileName(filepath);
  var splited = dirPath.split('/');

  var fullPath = splited[0] + '/';
  for (var i = 1; i < splited.length; i ++){
    fullPath += splited[i];
    if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath);
    fullPath += '/';
  }
}

function getExtention(filepath){
  if (filepath === undefined || filepath.length === 0)
    return filepath;

  var splited = filepath.split('.');
  return splited[splited.length - 1];
}