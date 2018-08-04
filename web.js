var express = require('express');
var fs = require('fs');
var http = require('https');

var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var app = express();
var port = 3000;


var dataServerPath = 'https://raw.githubusercontent.com/PieceOfPaper/Tree-of-IPF/master/';
var serverCode = 'kr';


// ---------- 테이블 데이터 불러오기
var tableData = [];
if (!fs.existsSync('./web/data')) fs.mkdirSync('./web/data');

loadTable('job', 'ies.ipf/job.ies');
loadTable('skill', 'ies.ipf/skill.ies');
loadTable('skilltree', 'ies.ipf/skilltree.ies');
loadTable('dialogtext', 'ies_client.ipf/dialogtext.ies');
function loadTable(name, path){
  tableData[name] = [];
  var file = fs.createWriteStream('./web/data/' + name + '.ies');
  var request = http.get(dataServerPath + serverCode + '/' + path, function(response) {
    response.pipe(file).on('close', function(){
      console.log('download table [' + name + ']');
      fs.createReadStream('./web/data/' + name + '.ies').pipe(csv()).on('data', function (data) {
        tableData[name].push(data);
      });
    });
  });
}


// ---------- 페이지 세팅
app.use(express.static('web'));
 
app.get('/', function (req, response) {
  fs.readdir('./web/img/npcimg', (err, files) => {
    var randomIndex = Math.floor(Math.random()*files.length);
    var imgname = files[randomIndex].split('.')[0];
    var dialogTable = tableData['dialogtext'];
    var captionList = [];
    for (var i = 0; i < dialogTable.length; i++){
      if (dialogTable[i].ImgName.indexOf(imgname) > -1){
        captionList.push(dialogTable[i]);
      }
    }
    var illustNpcName = imgname.replace('Dlg_port_', '');
    var illustNpcText = [];
    if (captionList.length > 0){
      var caption = captionList[Math.floor(Math.random()*captionList.length)];
      illustNpcName = caption.Caption;
      illustNpcText = caption.Text.split(/{np}|{nl}/g);
    }

    var output = '';
    output += '<html>';
    output += '<head>';
    output +=     '<title>Tree of Builder</title>';
    output +=     '<link rel="stylesheet" type="text/css" href="style.css">';
    output +=     '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />';
    output += '</head>';
    output += '<body align="center">';
    output +=     '<h1>Tree of Builder</h1>';
    output +=     '<img class="main-illust" src="../img/npcimg/' + files[randomIndex] + '" />';
    output +=     '<h2>' + illustNpcName + '</h2>';
    output +=     '<p>';
    for (var i = 0; i < illustNpcText.length; i ++){
      output +=     illustNpcText[i] + '<br/>';
    }
    output +=     '</p>';
    output += '</body>';
    output += '</html>';
  
    response.send(output);
  })
});

var skillPage = require('./web_script/web_skill')(app, tableData);
app.use('/Skill', skillPage);

var skillPage = require('./web_script/web_builder')(app, tableData);
app.use('/Builder', skillPage);

var testPage = require('./web_script/web_test')(app, tableData);
app.use('/Test', testPage);



// ---------- ON!
app.listen(port, function (){
  console.log("Server Open! port:" + port);
});