var express = require('express');
var fs = require('fs');
var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;

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


// ---------- 아이콘 이미지 복사
if (!fs.existsSync('./web/img')) fs.mkdirSync('./web/img');
if (!fs.existsSync('./web/img/icon')) fs.mkdirSync('./web/img/icon');

copyIconImage('../Tree-of-IPF/kr/ui.ipf/icon');
function copyIconImage(path) {
  fs.readdir(path, function(error, files) {
    if (files === undefined || files.length === 0)
      return;

    for (var i = 0; i < files.length; i ++) {
      if (files[i].indexOf('.png') > -1 || files[i].indexOf('.PNG') > -1) {
        var inStr = fs.createReadStream(path + '/' + files[i]);
        var outStr = fs.createWriteStream('./web/img/icon/' + files[i]);
        inStr.pipe(outStr);
      } else {
        copyIconImage(path + '/' + files[i])
      }
    }
  });
}

var classiconXmlData;
var classiconXmlList;
fs.readFile('../Tree-of-IPF/kr/ui.ipf/baseskinset/classicon.xml', function(error, data){
  var classiconXmlData = xml(data.toString());
  classiconXmlList = classiconXmlData.root.children[0].children;

  for (var i = 0; i < classiconXmlList.length; i ++){
    // tga 2 png
    var tgapath = classiconXmlList[i].attributes['file'].replace(/\\/g, '/');
    var tga = new TGA(fs.readFileSync('../Tree-of-IPF/kr/ui.ipf' + tgapath));
    var png = new PNG({
        width: tga.width,
        height: tga.height
    });
    png.data = tga.pixels;
    png.pack().pipe(fs.createWriteStream('./web/img' + tgapath + '.png'));

    
  }
  // console.log(xmlData.root.children.length);
  // console.log(xmlData.root.children[0].children.length);
  // console.log(xmlData.root.children[0].children[0].name);
  // console.log(xmlData.root.children[0].children[0].attributes['name']);
  // console.log(xmlData.root.children[0].children[0].attributes[0]);
});


// ---------- 페이지 세팅
app.use(express.static('web'));
 
app.get('/', function (req, response) {
    fs.readFile('index.html', function(error, data){
        if (error) {
            console.log(error);
            // 페이지를 찾을 수 없음
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
         }else{	
            // 페이지를 찾음	  
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {'Content-Type': 'text/html'});	
            
            // 파일을 읽어와서 responseBody 에 작성
            response.send(data);	
         }
    });
});

var skillPage = require('./web_script/web_skill')(app, tableData);
app.use('/Skill', skillPage);

var testPage = require('./web_script/web_test')(app, tableData);
app.use('/Test', testPage);



// ---------- ON!
app.listen(port, function (){
  console.log("Connect " + port);
});