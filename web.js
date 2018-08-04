var express = require('express');
var fs = require('fs');
var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var app = express();
var port = 3000;


// ---------- 테이블 데이터 불러오기
var tableData = [];
tableData['job'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/job.ies').pipe(csv()).on('data', function (data) {
  tableData['job'].push(data);
});
tableData['skill'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/skill.ies').pipe(csv()).on('data', function (data) {
  tableData['skill'].push(data);
});
tableData['skilltree'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies.ipf/skilltree.ies').pipe(csv()).on('data', function (data) {
  tableData['skilltree'].push(data);
});
tableData['dialogtext'] = [];
fs.createReadStream('../Tree-of-IPF/kr/ies_client.ipf/dialogtext.ies').pipe(csv()).on('data', function (data) {
  tableData['dialogtext'].push(data);
});


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