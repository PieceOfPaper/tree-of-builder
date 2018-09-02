var express = require('express');
var fs = require('fs');
var http = require('http');
var https = require('https');

var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var tos = require('./my_modules/TosModule');

var app = express();


var dataServerPath = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/';
var serverCode = 'kr';


if (!fs.existsSync('./web/data')) fs.mkdirSync('./web/data');
if (!fs.existsSync('./web/data/ies.ipf')) fs.mkdirSync('./web/data/ies.ipf');
if (!fs.existsSync('./web/data/ies_client.ipf')) fs.mkdirSync('./web/data/ies_client.ipf');
if (!fs.existsSync('./web/data/ies_ability.ipf')) fs.mkdirSync('./web/data/ies_ability.ipf');

// ---------- 테이블 데이터 불러오기
var tableData = [];
loadTable('job', 'ies.ipf/job.ies', function(){
  loadTable('ability', 'ies_ability.ipf/ability.ies', function(){
    loadTable('ability_job', 'ies_ability.ipf/ability_warrior.ies'); //Warrior만 소문자라 하드코딩;;
    for (var i = 0; i < tableData['job'].length; i ++){
      if (tableData['job'][i].EngName === 'Warrior') continue;
      loadTable('ability_job', 'ies_ability.ipf/ability_' + tableData['job'][i].EngName + '.ies');
    }
  });
});
loadTable('skill', 'ies.ipf/skill.ies');
loadTable('skilltree', 'ies.ipf/skilltree.ies');
loadTable('dialogtext', 'ies_client.ipf/dialogtext.ies');
loadTable('skill_attribute', 'ies.ipf/skill_attribute.ies');
loadTable('skill_Simony', 'ies.ipf/skill_Simony.ies');
loadTable('buff', 'ies.ipf/buff.ies', function(){
  loadTable('buff', 'ies.ipf/buff_contents.ies', function(){
    loadTable('buff', 'ies.ipf/buff_hardskill.ies', function(){
      loadTable('buff', 'ies.ipf/buff_mgame.ies', function(){
        loadTable('buff', 'ies.ipf/buff_monster.ies', function(){
          tableData['buff'].sort(function(a,b){
            if (a.ClassID > b.ClassID) return 1;
            else if (a.ClassID < b.ClassID) return -1;
            else return 0;
          });
        });
      });
    });
  });
});
function loadTable(name, path, callback){
  tableData[name] = [];
  var file = fs.createWriteStream('./web/data/' + path);
  var request = https.get(dataServerPath + serverCode + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download table [' + name + '] ' + path);
      fs.createReadStream('./web/data/' + path).pipe(csv()).on('data', function (data) {
        tableData[name].push(data);
      });
      if (callback != undefined){
        callback();
      }
    });
  });
}


// ---------- 스크립트 데이터 불러오기
var scriptData = [];
loadScript('shared.ipf/script/calc_property_skill.lua');
loadScript('shared.ipf/script/ability.lua');
loadScript('shared.ipf/script/ability_price.lua');
loadScript('shared.ipf/script/ability_unlock.lua');
function loadScript(path){
  var pathSplited = path.split('/');
  var filename = pathSplited[pathSplited.length - 1];
  var file = fs.createWriteStream('./web/data/' + filename);
  var request = https.get(dataServerPath + serverCode + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download script [' + filename + ']');
      fs.readFile('./web/data/' + filename, function(err, data){
        var luaFuncSplit = data.toString().split('function');
        for (var i = 0; i < luaFuncSplit.length; i ++){
          var methodName = luaFuncSplit[i].split('(')[0].trim();
          scriptData[methodName] = 'function' + luaFuncSplit[i];
          //console.log('[' + i + ']' + methodName);
        }
      });
    });
  });
}


// ---------- 페이지 세팅
app.use(express.static('web'));

var layout = fs.readFileSync('./web/Layout/index-main.html');
var layout_topMenu = fs.readFileSync('./web/Layout/topMenu.html');
 
app.get('/', function (req, response) {
  fs.readdir('./web/img/Dlg_portrait', (err, files) => {
    if (files === undefined){
      response.send(layout.toString());
      return;
    }

    var randomIndex = Math.floor(Math.random()*files.length);
    var imgname = files[randomIndex].split('.')[0].toLowerCase();
    var dialogTable = tableData['dialogtext'];
    var captionList = [];
    for (var i = 0; i < dialogTable.length; i++){
      if (dialogTable[i].ImgName.toLowerCase().indexOf(imgname) > -1){
        captionList.push(dialogTable[i]);
      }
    }
    var illustNpcName = imgname;
    var illustNpcText = [];
    if (captionList.length > 0){
      var caption = captionList[Math.floor(Math.random()*captionList.length)];
      illustNpcName = caption.Caption;
      //illustNpcText = caption.Text.split(/{np}|{nl}/g);
      illustNpcText = tos.parseCaption(caption.Text);
    }

    // var illustNpcMention = '';
    // for (var i = 0; i < illustNpcText.length; i ++){
    //   illustNpcMention +=     illustNpcText[i] + '<br/>';
    // }

    var output = layout.toString();
    output = output.replace(/style.css/g, '../Layout/style.css');
    output = output.replace(/%IllustPath%/g, '../img/Dlg_portrait/' + files[randomIndex]);
    output = output.replace(/%IllustName%/g, illustNpcName);
    output = output.replace(/%IllustMention%/g, illustNpcText);

    output = output.replace(/%AddTopMenu%/g, layout_topMenu.toString());
  
    response.send(output);
  })
});

var skillPage = require('./web_script/web_skill')(app, tableData, scriptData);
app.use('/Skill', skillPage);

var abilityPage = require('./web_script/web_ability')(app, tableData, scriptData);
app.use('/Ability', abilityPage);

// var skillPage = require('./web_script/web_builder')(app, tableData);
// app.use('/Builder', skillPage);

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
});
// httpsServer.listen(https_port, function (){
//   console.log("Https Server Open! port:" + https_port);
// });