var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');
var session = require('express-session');

const { Pool, Client } = require('pg');
var mysql = require('mysql');

var csv = require('csv-parser');
var xml = require('xml-parser');
var bodyParser = require('body-parser')

var Slack = require('slack-node');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var tos = require('./my_modules/TosModule');

var nodelua = require('node-lua');
var lua = new nodelua.LuaState();

var cmd=require('node-cmd');

var app = express();


var webhookUri = 'https://hooks.slack.com/services/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';
var dataServerPath = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/';
var serverCode = 'kr';
var isLocalServer = false;

var noDownload = false;
var slackOff = false;


slack = new Slack();
slack.setWebhook(webhookUri);
function sendSlack(message){
  if (slackOff) return;
  slack.webhook({
    channel: '#web-' + serverCode,
    username: "webhookbot",
    text: message,
  }, function(err, response) { console.log(response); });
}

process.argv.forEach(function (val, index, array) {
  if (val != undefined){

    //option
    if (val == 'noDownload'){
      noDownload = true;
      console.log('No Downlaod');
    } else if (val == 'slackOff'){
      slackOff = true;
      console.log('Slack Off');

    //change server
    } else if (val == 'server-kr'){
      serverCode = 'kr';
      console.log('change server ' + serverCode);
    } else if (val == 'server-ktest'){
      serverCode = 'ktest';
      console.log('change server ' + serverCode);
    } else if (val == 'server-global'){
      serverCode = 'global';
      console.log('change server ' + serverCode);
    } else if (val == 'server-local'){
      serverCode = 'ktest';
      isLocalServer = true;
      console.log('change server ' + serverCode);
    }
  }
});
console.log('argument loaded');



console.log('### DB Connect Request');
var connection = undefined;
if (isLocalServer){
  connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'localhost',
    database : 'tree-of-builder',
  });
} else {
  connection = mysql.createConnection({
    host     : '35.220.156.207',
    user     : 'root',
    password : 'cGbwHENEf6AmkDhc',
    database : 'tree-of-builder',
  });
}
 
connection.connect(function(err) {
  if (err) {
    console.error('### DB Connect Error: ' + err.stack);
    return;
  }
  console.log('### DB Connect Success. connected as id ' + connection.threadId);
});
//connection.end();



if (!fs.existsSync('./web/data')) fs.mkdirSync('./web/data');
if (!fs.existsSync('./web/data/ies.ipf')) fs.mkdirSync('./web/data/ies.ipf');
if (!fs.existsSync('./web/data/ies_client.ipf')) fs.mkdirSync('./web/data/ies_client.ipf');
if (!fs.existsSync('./web/data/ies_ability.ipf')) fs.mkdirSync('./web/data/ies_ability.ipf');
if (!fs.existsSync('./web/data/xml_lang.ipf')) fs.mkdirSync('./web/data/xml_lang.ipf');

// ---------- 테이블 데이터 불러오기
var tableData = [];
loadTable('job', 'ies.ipf/job.ies', function(){
  loadTable('ability', 'ies_ability.ipf/ability.ies', function(){
    loadTable('ability_job', 'ies_ability.ipf/ability_warrior.ies'); //Warrior만 소문자라 하드코딩;;
    for (var i = 0; i < tableData['job'].length; i ++){
      if (tableData['job'][i].EngName === 'Warrior') continue;
      loadTable('ability_job', 'ies_ability.ipf/ability_' + tableData['job'][i].EngName + '.ies');
    }
    tableData['job'].sort(function(a,b){
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
    for(var i=0;i<tableData['skill_mon'].length;i++){
      tableData['skill'].push(tableData['skill_mon'][i]);
    }
    console.log('merge skill+skill_mon');
  });
  loadTable('skill_Simony', 'ies.ipf/skill_Simony.ies', function(){
    for(var i=0;i<tableData['skill_Simony'].length;i++){
      for(var j=0;j<tableData['skill'].length;j++){
        if(tableData['skill'][j].ClassID==tableData['skill_Simony'][i].ClassID){
          tableData['skill'][j]['CanMakeSimony'] = tableData['skill_Simony'][i].CanMake;
          break;
        }
      }
    }
    console.log('merge skill+simony');
  });
  loadTable('skilltree', 'ies.ipf/skilltree.ies', function(){
    for(var i=0;i<tableData['skilltree'].length;i++){
      for(var j=0;j<tableData['skill'].length;j++){
        if(tableData['skill'][j].ClassName==tableData['skilltree'][i].SkillName){
          tableData['skill'][j]['SkillTree'] = tableData['skilltree'][i].ClassName;
          break;
        }
      }
    }
    console.log('merge skill+skilltree');
  });
});
loadTable('dialogtext', 'ies_client.ipf/dialogtext.ies');
loadTable('skill_attribute', 'ies.ipf/skill_attribute.ies');
//loadTable('skill_Simony', 'ies.ipf/skill_Simony.ies');
loadTable('buff', 'ies.ipf/buff.ies', function(){
  loadTable('buff', 'ies.ipf/buff_contents.ies', function(){
    loadTable('buff', 'ies.ipf/buff_hardskill.ies', function(){
      loadTable('buff', 'ies.ipf/buff_mgame.ies', function(){
        loadTable('buff', 'ies.ipf/buff_monster.ies', function(){
          // tableData['buff'].sort(function(a,b){
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
    for (param in tableData['item_Equip']) tableData['item'].push(tableData['item_Equip'][param]);
    loadTable('item_Quest', 'ies.ipf/item_Quest.ies', function(){
      for (param in tableData['item_Quest']) tableData['item'].push(tableData['item_Quest'][param]);
      loadTable('item_gem', 'ies.ipf/item_gem.ies', function(){ 
        for (param in tableData['item_gem']) tableData['item'].push(tableData['item_gem'][param]);
        loadTable('item_premium', 'ies.ipf/item_premium.ies', function(){  
          for (param in tableData['item_premium']) tableData['item'].push(tableData['item_premium'][param]);
          loadTable('item_recipe', 'ies.ipf/wiki_recipe.ies', function(){  
            for (param in tableData['item_recipe']) tableData['item'].push(tableData['item_recipe'][param]);
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
    for (param in tableData['camp_warp']){
      var mapdata = tos.FindDataClassName(tableData,'map2',tableData['camp_warp'][param].Zone);
      if (mapdata != undefined){
        mapdata['CanCampWarp']=true;
      }
    }
  });
});
loadTable('guild_event', 'ies.ipf/guild_event.ies');
loadTable('companion', 'ies.ipf/companion.ies');
loadTable('foodtable', 'ies.ipf/foodtable.ies');
function loadTable(name, path, callback){
  if (tableData[name] === undefined) tableData[name] = [];
  if (noDownload && fs.existsSync('./web/data/' + path)){
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
      tableData[name].push(data);
    }).on('end', function(){
      console.log('import table [' + name + ']' + tableData[name].length + ' ' + path);
      if (callback != undefined){
        callback();
      }
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  var request = https.get(dataServerPath + serverCode + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download table [' + name + '] ' + path);
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
        tableData[name].push(data);
      }).on('end', function(){
        console.log('import table [' + name + ']' + tableData[name].length + ' ' + path);
        if (callback != undefined){
          callback();
        }
      });
    });
  });
}


// ---------- 스크립트 데이터 불러오기
var scriptData = [];
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
    scriptData[methodName] = 'function' + luaFuncSplit[i];
  }
  // 파일로 저장
  fs.writeFile('./web/js/generated_lua.lua', clearedResultTrim, function(err) {
      if(err) return console.log(err);
      console.log('Success Generate Lua Scripts');
      //lua.DoString(clearedResultTrim);
      cmd.run('./web/js/luajs/lua2js ./web/js/generated_lua.lua ./web/js/generated_lua.js')
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
  if (noDownload && fs.existsSync('./web/lua/' + filename)){
    fs.readFile('./web/lua/' + filename, function(err, data){
      if (err) {
        sendSlack(err.toString());
        generateLuaScript(array, index + 1, function(result){
          callback(result);
        });
        return;
      }
      luaString = data.toString();
      console.log('import script [' + filename + ']');
      generateLuaScript(array, index + 1, function(result){
        callback(luaString + '\n' + result);
      });
    });
  } else {
    var file = fs.createWriteStream('./web/lua/' + filename);
    var request = https.get(dataServerPath + serverCode + '/' + array[index], function(response) {
      response.pipe(file).on('close', function(){
        console.log('download script [' + filename + ']');
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
  console.log('language table ' + tableData['language'].length);
});
function loadTableLanguage(name, path, callback){
  if (tableData[name] === undefined) tableData[name] = [];
  if (noDownload && fs.existsSync('./web/data/' + path)){
    fs.readFile('./web/data/' + path, function(error, data){
      if (error) sendSlack(err.toString());
      var xmlData = xml(data.toString());
      if (xmlData.root === undefined || xmlData.root.children === undefined)
        return;
      for (var i = 0; i < xmlData.root.children.length; i ++){
        for (var j = 0; j < xmlData.root.children[i].children.length; j ++){
          if (xmlData.root.children[i].children[j].attributes['ClassName'] == undefined) continue;
          tableData[name][xmlData.root.children[i].children[j].attributes['ClassName']] = xmlData.root.children[i].children[j].attributes['Data'];
        }
      }
      console.log('import table [' + name + '] ' + path);
      if (callback != undefined){
        callback();
      }
    });
    return;
  }
  var file = fs.createWriteStream('./web/data/' + path);
  var request = https.get(dataServerPath + serverCode + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download table [' + name + '] ' + path);
      fs.readFile('./web/data/' + path, function(error, data){
        if (error) sendSlack(err.toString());
        var xmlData = xml(data.toString());
        if (xmlData.root === undefined || xmlData.root.children === undefined)
          return;
        for (var i = 0; i < xmlData.root.children.length; i ++){
          for (var j = 0; j < xmlData.root.children[i].children.length; j ++){
            if (xmlData.root.children[i].children[j].attributes['ClassName'] == undefined) continue;
            tableData[name][xmlData.root.children[i].children[j].attributes['ClassName']] = xmlData.root.children[i].children[j].attributes['Data'];
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
  fs.readdir('./web/img/Dlg_portrait', (err, files) => {
    if (err) sendSlack(err.toString());
    if (files === undefined){
      response.send(layout.toString());
      return;
    }

    var randomIndex = Math.floor(Math.random()*files.length);
    var imgname = files[randomIndex].split('.')[0].toLowerCase();
    var dialogTable = tableData['dialogtext'];
    var captionList = [];
    for (var i = 0; i < dialogTable.length; i++){
      if (dialogTable[i].ImgName != undefined && dialogTable[i].ImgName.toLowerCase().indexOf(imgname) > -1){
        captionList.push(dialogTable[i]);
      }
    }
    var illustNpcName = imgname;
    var illustNpcText = '';
    if (captionList.length > 0){
      var caption = captionList[Math.floor(Math.random()*captionList.length)];
      illustNpcName = caption.Caption;
      //illustNpcText = caption.Text.split(/{np}|{nl}/g);
      //illustNpcText = tos.parseCaption(caption.Text);
      var illustNpcText = caption['Text'];
      if (illustNpcText != undefined){
        illustNpcText = illustNpcText.replace(/{nl}/g,'<br>');
        illustNpcText = illustNpcText.replace(/{np}/g,'<br><p style="width:calc(100% - 20px); text-align:center;">◆◆◆</p><br>');
      } else {
        illustNpcText = '';
      }
    }

    // var illustNpcMention = '';
    // for (var i = 0; i < illustNpcText.length; i ++){
    //   illustNpcMention +=     illustNpcText[i] + '<br/>';
    // }

    var serverName = '';
    switch(serverCode){
      case 'kr':
      serverName = 'Korea';
      break;
      case 'ktest':
      serverName = 'Korea Test';
      break;
    }



    var output = layout.toString();
    output = output.replace(/style.css/g, '../style.css');
    output = output.replace(/%IllustPath%/g, '../img/Dlg_portrait/' + files[randomIndex]);
    output = output.replace(/%IllustName%/g, illustNpcName);
    output = output.replace(/%IllustMention%/g, illustNpcText);
    output = output.replace(/%ServerName%/g, serverName);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());

    var loginData = '';
    if (req.session.login_userno == undefined){
      loginData += '<form action="/Login" method="POST" style="padding:0; margin:0; width:calc(100vw - 20px);">';
      loginData +=   '<p style="width:calc(100vw - 20px); text-align:center;">Email <input type="email" name="email"></p>';
      loginData +=   '<p style="width:calc(100vw - 20px); text-align:center;">Pwd <input type="password" name="pwd"></p>';
      loginData +=   '<p style="width:calc(100vw - 20px); text-align:center;"><button type="submit">Login</button></p>';
      loginData += '</form>';
      loginData += '<p style="width:calc(100vw - 20px); text-align:center;"><a href="./JoinPage">Join</a></p>';

      output = output.replace(/%LoginData%/g, loginData);
    
      response.send(output);
    } else {
        connection.query('SELECT * FROM user WHERE userno="'+req.session.login_userno+'";', function (error, results, fields) {
          if (error) throw error;
          if (results != undefined && results.length > 0){
            loginData += '<p style="width:calc(100vw - 20px); text-align:center;">Welocme. '+results[0].nickname+'</p>';
            loginData += '<br/>';
            if (results[0].mail_auth == undefined || results[0].mail_auth != "A"){
              loginData += '<p style="width:calc(100vw - 20px); text-align:center;">No Authenticated User.</p>';
              loginData += '<p style="width:calc(100vw - 20px); text-align:center;"><a href="./ReqJoinMail?email='+results[0].email+'">Request Auth Mail</a></p>';
              loginData += '<br/>';
            }
          } else {
            loginData += '<p style="width:calc(100vw - 20px); text-align:center;">Longin Error</p>';
            loginData += '<br/>';
          }
          loginData += '<p style="width:calc(100vw - 20px); text-align:center;"><a href="./Logout">Logout</a></p>';

          output = output.replace(/%LoginData%/g, loginData);
        
          response.send(output);
      });
    }
  })
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

var dataServer = require('./data_server/data_server')(app, tableData);
app.use('/data', dataServer);

var boardFree = require('./board_server/board_free')(app, connection);
app.use('/BoardFree', boardFree);

var skillPage = require('./web_script/web_skill')(app, tableData, scriptData);
app.use('/Skill', skillPage);

var abilityPage = require('./web_script/web_ability')(app, tableData, scriptData);
app.use('/Ability', abilityPage);

var buffPage = require('./web_script/web_buff')(app, tableData, scriptData);
app.use('/Buff', buffPage);

var itemPage = require('./web_script/web_item')(app, tableData, scriptData);
app.use('/Item', itemPage);

var monsterPage = require('./web_script/web_monster')(app, tableData, scriptData);
app.use('/Monster', monsterPage);

var questPage = require('./web_script/web_quest')(app, tableData, scriptData);
app.use('/Quest', questPage);

var mapPage = require('./web_script/web_map')(app, tableData, scriptData);
app.use('/Map', mapPage);

var dialogPage = require('./web_script/web_dialog')(app, tableData, scriptData);
app.use('/Dialog', dialogPage);

var miscGuildEventPage = require('./web_script/web_misc_guildevent')(app, tableData, scriptData);
app.use('/GuildEvent', miscGuildEventPage);

var miscCompanionPage = require('./web_script/web_misc_companion')(app, tableData, scriptData);
app.use('/Companion', miscCompanionPage);

var builderPage = require('./web_script/web_builder')(app, tableData, scriptData);
app.use('/Builder', builderPage);

var toolQuestCalcPage = require('./web_script/web_tool_questcalculator')(app, tableData, scriptData);
app.use('/QuestCalculator', toolQuestCalcPage);

var toolFoodCalcPage = require('./web_script/web_tool_foodcalculator')(app, tableData, scriptData);
app.use('/FoodCalculator', toolFoodCalcPage);

var db_loginPage = require('./web_script/DBPage/web_login')(app, tableData, scriptData, connection);
app.use('/Login', db_loginPage);

var db_logoutPage = require('./web_script/DBPage/web_logout')(app, tableData, scriptData, connection);
app.use('/Logout', db_logoutPage);

var db_joinPage = require('./web_script/DBPage/web_join')(app, tableData, scriptData, connection);
app.use('/Join', db_joinPage);

var db_reqJoinMailPage = require('./web_script/DBPage/web_reqJoinMail')(app, tableData, scriptData, connection);
app.use('/ReqJoinMail', db_reqJoinMailPage);

var db_emailAuthPage = require('./web_script/DBPage/web_emailAuth')(app, tableData, scriptData, connection);
app.use('/EmailAuth', db_emailAuthPage);

// var testPage = require('./web_script/web_test')(app, tableData);
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